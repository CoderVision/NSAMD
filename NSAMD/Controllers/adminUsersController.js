

'use strict';

angular.module('app').controller('adminUsersController',
    ['$scope','$mdDialog', '$mdMedia', '$location', '$log', 'userService', 'appNotificationService'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, userService, appNotificationService) {

            var vm = this;

            vm.message = "Hello from users controller!";
            vm.acctRequests = [];
            vm.config = {};
            vm.users = [];
            vm.isLoading = true;
            vm.searchText = "";
            vm.selectedUser = {};
            vm.filterActive = true;
            vm.selectedIndex = 0;
            vm.usersOrdered = [];

            //$scope.$watch("uc.usersOrdered", function (value) {
            //    if (value && value.length > 0)
            //        vm.edit(0, vm.usersOrdered[0]);
            //});

            // order the list when it changes and set it to the array
            $scope.$watch("uc.getUsers() | orderBy : 'fullName'", function (newValue) {

                if (newValue && newValue.length) {
                    vm.usersOrdered = newValue;
                    vm.edit(0, vm.usersOrdered[0]);
                }
            }, true);

            vm.edit = function (index, user) {
                vm.selectedIndex = index;
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

                var patchDocument = [];

                if (propertyName == "roleId" && value == 2)
                {
                    // if the user is an admin
                    patchDocument = [{
                        "op": "replace",
                        "path": "/roleId",
                        "value": "2"
                    },
                    {
                        "op": "replace",
                        "path": "/churchIds",
                        "value": []
                    }];
                }
                else {
                    patchDocument = [{
                        "op": "replace",
                        "path": "/" + propertyName,
                        "value": value
                    }];
                }

                userService.patch(vm.selectedUser.userId, patchDocument).then(function (success) {
                    // do nothing
                    //var s = success;
                    vm.resetForm();

                }, function (error) {
                    appNotificationService.openToast("Error saving user:  " + error);
                })
            }

            vm.resetForm = function () {
                if (vm.selectedUser.roleId == 2)
                {
                    vm.selectedUser.churchIds = [];
                    $scope.userfrm.$setPristine();
                    $scope.userfrm.$setUntouched();
                }
            }

            vm.changeMembership = function ($event)
            {
                // open a dialog with the following:
                // a member search box  - md auto complete?
                // dropdown list of members
                // checkbox to merge member profiles
                // checkbox to change member profiles - delete one associated with user and assign to new
                // 
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

                $mdDialog.show({
                    locals: { currentItem: vm.selectedUser },
                    templateUrl: './views/admin/changeMembership.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: "adminChangeMembershipController",
                    controllerAs: 'dc', // dc = dialog controller
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then(function (editedItem) {

                    vm.selectedUser.churchId = editedItem.churchId;
                    vm.selectedUser.church = editedItem.church;

                }, function () {
                    $log.info("change membership cancelled");
                });
            }
            return vm;
        }]);