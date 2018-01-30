

'use strict';

angular.module('app').controller('adminUsersController',
    ['$scope','$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'userService', 'appNotificationService'
        , function ($scope, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, userService, appNotificationService) {

            var vm = this;

            vm.message = "Hello from users controller!";
            vm.acctRequests = [];
            vm.config = {};
            vm.users = [];
            vm.isLoading = true;
            vm.searchText = "";
            vm.selectedUser = {};
            vm.filterActive = true;

            vm.edit = function (user) {
                vm.selectedUser = user;
            }           

            vm.load = function () {
                userService.getList(vm.filterActive).then(function (success) {

                    vm.config = success.config;
                    vm.acctRequests = success.acctRequests;
                    vm.users = success.users;

                    if (vm.users.length > 0)
                        vm.edit(vm.users[0]); // select the first one in the list

                }, function (error) {
                    appNotificationService.openToast("Error loading member config:  " + error);
                }).then(function () {
                    vm.isLoading = false;
                });
            }

            vm.expand = function (item) {
                if (!item.isExpanded)
                    item.isExpanded = true;
                else
                    item.isExpanded = false;
            }

            vm.formatDate = function (utcDate) {
                return moment.tz(utcDate, moment.tz.guess()).format("L LT");
            }

            vm.submitRequest = function (acctReq, isApproved) {
                acctReq.isApproved = isApproved;

                userService.processAcctRequest(acctReq).then(function (success) {

                    const index = vm.acctRequests.indexOf(acctReq);
                    vm.acctRequests.splice(index, 1);

                }, function (error) {
                    appNotificationService.openToast("Error processing account request:  " + error);
                });
            }

            vm.getUsers = function () {
                var searchCriteria = vm.searchText.trim();
                if (searchCriteria.length == 0)
                    return vm.users;
                else {
                    searchCriteria = searchCriteria.toLowerCase();
                    var users = [];
                    for (var i = 0; i < vm.users.length; i++) {
                        var user = vm.users[i];
                        if (user.fullName.toLowerCase().indexOf(searchCriteria) > -1) {
                            users.push(user);
                        }
                    }
                    return users;
                }
            }

            vm.patch = function (propertyName, value) {
                return;
            }

            vm.resetForm = function () {
                if (vm.selectedUser.roleId == 2)
                {
                    $scope.userfrm.$setPristine();
                    $scope.userfrm.$setUntouched();
                }
            }
            return vm;
        }]);