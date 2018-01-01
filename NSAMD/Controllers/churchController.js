
'use strict';

angular.module('app').controller('churchController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', '$routeParams', 'churchService', 'configService', 'appNotificationService', 'teamService', '$q', 'appService'
        , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, $routeParams, churchService, configService, appNotificationService, teamService, $q, appService) {

            var vm = this;

            vm.churchId = $routeParams.churchId;
            vm.church = {};
            vm.isLoading = true;
            vm.config = {};
            vm.useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            vm.load = function () {

                appService.title = "Churches";

                vm.isLoading = true;

                // get meta data
                churchService.getConfig(vm.churchId).then(function (success) {

                    vm.config = success;

                    vm.config.timeZones = configService.getTimeZones();

                    // get church profile   
                    churchService.get(vm.churchId).then(function (success) {

                        vm.church = success;

                        //appNotificationService.openToast("success");
                    }, function (error) {
                        
                        appNotificationService.openToast("Error loading church " + vm.churchId + ":  " + error);
                    }).then(function () {
                        vm.isLoading = false;
                    });
                }, function (error) {
                    appNotificationService.openToast("Error loading church config ");
                }).then(function () {
                    vm.isLoading = false;
                });
            };


            vm.patch = function (fieldName, fieldValue) {
                churchService.patch(vm.churchId, fieldName, fieldValue).then(function (success) {
                    appNotificationService.openToast("Save success");
                }, function (error) {
                    appNotificationService.openToast("Error saving church " + vm.churchId + ":  " + error);
                });
            }

            vm.patchEmailConfig = function () {

                // all 3 of these are required to save the email config
                if (vm.church.emailConfigProfileId == undefined
                    || (vm.church.emailConfigUsername == undefined || vm.church.emailConfigUsername.trim() == "")
                    || (vm.church.emailConfigPassword == undefined || vm.church.emailConfigPassword.trim() == "")) {
                    return;
                }

                var patchDocument = [{
                    "op": "replace",
                    "path": "/emailConfigProfileId",
                    "value": vm.church.emailConfigProfileId
                },
                {
                    "op": "replace",
                    "path": "/emailConfigUsername",
                    "value": vm.church.emailConfigUsername
                },
                {
                    "op": "replace",
                    "path": "/emailConfigPassword",
                    "value": vm.church.emailConfigPassword
                }];

                patchDoc(vm.churchId, patchDocument);
            }

            function patchDoc(churchId, patchDocument) {
                churchService.patchDoc(churchId, patchDocument).then(function (success) {
                    appNotificationService.openToast("Save success");
                }, function (error) {
                    appNotificationService.openToast("Error saving church " + vm.churchId + ":  " + error);
                });
            }

            vm.addAddress = function (type, $event) {

                var addy = { isNew: true, IdentityId: vm.churchId };  // empty object will get relative properties created when binding to the modal

                vm.editAddress(type, addy, $event);
            }

            vm.editAddress = function (type, addy, $event) {

                var config = GetEditConfiguration(type);

                addy.identityId = vm.churchId;
                addy.type = type;
                addy.contactInfoType = config.ContactInfoType;

                var editAddy = angular.copy(addy);

                $mdDialog.show({
                    locals: { currentItem: editAddy },
                    templateUrl: config.template,
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: config.controller,
                    controllerAs: 'dc', // dc = dialog controller
                    clickOutsideToClose: true,
                    fullscreen: vm.useFullScreen
                }).then(function (editedItem) {

                    churchService.saveAddy(editedItem).then(function (success) {

                        if (editedItem.isNew)
                            config.push(success);
                        else
                            angular.copy(success, addy);

                        $log.info("Edit item saved");
                        appNotificationService.openToast("Save success");

                    }, function (error) {
                        $log.info("Error saving addy");
                    });

                }, function () {
                    $log.info("Edit item cancelled");
                });
            }

            function GetEditConfiguration(type) {
                var config = {};
                config.controller = "simpleDialogController";
                if (type == "email") {
                    config.template = './views/app/emailDialog.html';
                    config.ContactInfoType = 2;
                    config.push = function (item) {
                        vm.church.emailList.push(item);
                    }
                }
                else if (type == "phone") {
                    config.template = './views/app/phoneDialog.html';
                    config.ContactInfoType = 3;
                    config.push = function (item) {
                        vm.church.phoneList.push(item);
                    }
                }
                else {
                    config.template = './views/app/addressDialog.html';
                    config.ContactInfoType = 1;
                    config.push = function (item) {
                        vm.church.addressList.push(item);
                    }
                }
                return config;
            }

            vm.addTeammate = function ($event) {

                var newTeammate = { isNew: true, churchId: vm.churchId, teamId: 0, memberId: 0, positionTypeEnumId: 0 }; // 70=Pastor

                vm.editTeammate($event, newTeammate);
            }

            vm.editTeammate = function ($event, teammate) {

                var editTeammate = angular.copy(teammate);

                $mdDialog.show({
                    locals: { currentItem: editTeammate, config: vm.config },
                    templateUrl: './views/teams/addTeamMemberDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: "simpleDialogController",
                    controllerAs: 'dc', // dc = dialog controller
                    clickOutsideToClose: true,
                    fullscreen: vm.useFullScreen
                }).then(function (editedItem) {

                    saveTeammate(editedItem, teammate);

                }, function () {
                   // $log.info("Edit item cancelled");
                });
            }

            function saveTeam() {
                var deferred = $q.defer();

                if (vm.church.pastoralTeam == undefined) {

                    // save team first
                    var team = {};
                    team.id = 0;
                    team.name = vm.church.name + " Pastoral Team";
                    team.desc = "Pastoral Team for " + vm.church.name;
                    team.churchId = vm.church.Id;
                    team.teamTypeEnumId = 68;
                    team.teamPositionEnumTypeId = 17;

                    teamService.saveTeam(team).then(function (success) {

                        vm.church.pastoralTeam = success;
                        deferred.resolve(vm.church.pastoralTeam);

                    }, function (error) {
                        deferred.reject(error);
                    });
                }
                else {
                    deferred.resolve(vm.church.pastoralTeam);
                }

                return deferred.promise;
            }

            function saveTeammate(editedItem, teammate)
            {
                saveTeam().then(function (success) {

                    editedItem.teamId = success.id;

                    teamService.saveTeammate(editedItem).then(function (success) {

                        if (editedItem.isNew) {
                            success.isNew = false;
                            vm.church.pastoralTeam.teammates.push(success);
                        }
                        else
                            angular.copy(success, teammate);

                        $log.info("teammate saved");
                        appNotificationService.openToast("Save success");

                    }, function (error) {
                        $log.info(error);
                    });
                })
            }

            vm.removeTeammate = function(teammate, $event)
            {
                teamService.removeTeammate(teammate).then(function (success) {

                    for (var i = vm.church.pastoralTeam.teammates.length - 1; i >= 0; i--) {
                        if (vm.church.pastoralTeam.teammates[i].id == teammate.id)
                            vm.church.pastoralTeam.teammates.splice(i, 1);
                    }

                }, function (error) {
                    appNotificationService.openToast( error);
                });
            }

            vm.removeAddress = function (type, addy, $event) {

                churchService.removeAddy(addy).then(function (success) {

                    if (type == "phone") {
                        for (var i = vm.church.phoneList.length - 1; i >= 0; i--) {
                            if (vm.church.phoneList[i].contactInfoId == addy.contactInfoId)
                                vm.church.phoneList.splice(i, 1);
                        }
                    }
                    else if (type == "email") {
                        for (var i = vm.church.emailList.length - 1; i >= 0; i--) {
                            if (vm.church.emailList[i].contactInfoId == addy.contactInfoId)
                                vm.church.emailList.splice(i, 1);
                        }
                    }
                    else if (type == "address") {
                        for (var i = vm.church.addressList.length - 1; i >= 0; i--) {
                            if (vm.church.addressList[i].contactInfoId == addy.contactInfoId)
                                vm.church.addressList.splice(i, 1);
                        }
                    }

                }, function (error) {
                    appNotificationService.openToast("Error deleting " + type + ":  " + error);
                });
            }

            vm.openPhone = function (addy, $event) {

                if (!addy.phoneNumber || addy.phoneNumber.length == 0)
                    return;

                var value = addy.phoneNumber.toString().trim().replace(/^\+/, '');

                var city = value.slice(0, 3);
                var number = value.slice(3);
                number = number.slice(0, 3) + '-' + number.slice(3);

                //<a href="tel:@(String.Format("{0:###-###-####}", double.Parse(m.Phone)))"><img class="icon32" src="~/Content/images/Calls-32.png" alt="call" /></a>
                $window.location.href = "callto://" + city + "-" + number;
            }

            vm.openMap = function (addy, $event) {

                var address = "";
                if (addy.line1 && addy.line1.length > 0)
                    address = addy.line1.trim() + ",";

                if (addy.city && addy.city.length > 0)
                    address += addy.city.trim() + ",";

                if (addy.state && addy.state.length > 0)
                    address += addy.state.trim() + " ";

                if (addy.zip && addy.zip.length > 0)
                    address += addy.zip.trim();

                //<a href="https://www.google.com/maps/place/@(m.Address?.Replace(' ', '+'))")><img class="icon32" src="~/Content/images/Maps-32.png" alt="map" /></a>
                var rx = new RegExp(' ', 'g');
                var url = $location.protocol() + "://www.google.com/maps/place/" + address.replace(rx, '+');

                $window.open(url);
            }

            return vm;
        }]);
