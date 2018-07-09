

'use strict';

angular.module('app').controller('memberController',
    ['$scope', '$stateParams', '$mdMedia', '$mdDialog', '$mdBottomSheet', '$location', '$log', '$window', 'memberService', 'appNotificationService', 'localStorageService', 'appService'
        , function ($scope, $stateParams, $mdMedia, $mdDialog, $mdBottomSheet, $location, $log, $window, memberService, appNotificationService, localStorageService, appService) {

        var vm = this;

        $scope.$emit('enableAddItemEvent', { enabled: false });

        vm.memberId = $stateParams.memberId;
        vm.churchId = $stateParams.churchId;

        vm.member = {};
        vm.memberList = [];
        vm.teamList = [];

        vm.churchList = [];
        vm.contactInfoTypeList = [];
        vm.contactInfoLocationTypeList = [];
        vm.phoneTypeList = [];
        vm.memberStatusChangeTypeList = [];
        vm.memberStatusList = [];
        vm.memberTypeList = [];

        vm.selectedSponsors = [];
        vm.selectedSponsor = null;
        vm.sponsorSearchText = null;
        vm.selectedTeams = [];
        vm.selectedTeam = null;
        vm.teamSearchText = null;

        vm.isLoading = false;

        // init()
        vm.loadMember = function () {

            appService.title = "Members";

            vm.isLoading = true;

            // get meta data
            memberService.getConfig(vm.churchId).then(function (success) {
                vm.memberList = success.memberList;
                vm.teamList = success.teamList;
                vm.churchList = success.churchList;
                vm.contactInfoTypeList = success.contactInfoTypeList;
                vm.contactInfoLocationTypeList = success.contactInfoLocationTypeList;
                vm.phoneTypeList = success.phoneTypeList;
                vm.memberStatusChangeTypeList = success.memberStatusChangeTypeList;
                vm.memberStatusList = success.memberStatusList;
                vm.memberTypeList = success.memberTypeList;

                // get member profile   
                memberService.get(vm.memberId, vm.churchId).then(function (success) {
                    vm.member = success;

                    // create selected
                    //vm.selectedSponsors = success.sponsorList;
                    vm.selectedSponsors = vm.memberList.filter(function (member) {
                        for (var i = 0; i < vm.member.sponsorList.length; i++) {
                            if (member.id == vm.member.sponsorList[i].sponsorId) {
                                return true;
                            }
                        }
                        return false;
                    });

                    //vm.selectedTeams = success.teamList;
                    vm.selectedTeams = vm.teamList.filter(function (team) {
                        for (var i = 0; i < vm.member.teamList.length; i++) {
                            if (team.id == vm.member.teamList[i].teamId) {
                                return true;
                            }
                        }
                        return false;
                    });

                    //appNotificationService.openToast("success");
                }, function (error) {
                    appNotificationService.openToast("Error loading member " + vm.memberId + ":  " + error);
                }).then(function () {
                    vm.isLoading = false;
                });
            }, function (error) {
                appNotificationService.openToast("Error loading member config ");
            });
        };

        $scope.$watch("mc.selectedSponsors", function (sponsors) {

            if (vm.isLoading == true)
                return;

            var list = [];
            if (sponsors.length > 0) {
                for (var i = 0; i < sponsors.length; i++) {
                    var s = {
                        SponsorId: sponsors[i].id,
                        MemberId: vm.memberId,
                        FirstName: "",
                        LastName: ""
                    };
                    list.push(s);
                }
            }
            vm.patch("sponsorList", list);
        }, true);

        $scope.$watch("mc.selectedTeams", function (teams) {

            if (vm.isLoading == true)
                return;

            var list = [];
            if (teams.length > 0) {
                for (var i = 0; i < teams.length; i++) {
                    var s = {
                        TeamId: teams[i].id,
                        MemberId: vm.memberId,
                        TeamName: ""
                    };
                    list.push(s);
                }
            }
            vm.patch("teamList", list);
        }, true);

        // Sponsors
        vm.sponsorSearch = function (sponsorSearchText) {
            var result = vm.memberList.filter(sponsorFilter);
            return result;
        }
        function sponsorFilter(member) { 
            var lowercase = angular.lowercase(vm.sponsorSearchText);
            return (member.desc.toLowerCase().indexOf(lowercase) === 0);
        }

        // Teams
        vm.teamSearch = function (teamSearchText) {
            var result = vm.teamList.filter(teamFilter);
            return result;
        }
        function teamFilter(team) {
            var lowercase = angular.lowercase(vm.teamSearchText);
            return (team.desc.toLowerCase().indexOf(lowercase) === 0);
        }



        vm.patch = function (fieldName, fieldValue) {
            memberService.patch(vm.memberId, vm.churchId, fieldName, fieldValue).then(function (success) {
                // vm.member = success;
                appNotificationService.openToast("Save success");
            }, function (error) {
                appNotificationService.openToast("Error saving member " + vm.memberId + ":  " + error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.addAddress = function (type, $event) {

            var addy = { isNew: true, IdentityId: vm.memberId };  // empty object will get relative properties created when binding to the modal

            vm.editAddress(type, addy, $event);
        }

        vm.editAddress = function (type, addy, $event) {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            var config = GetEditConfiguration(type);

            addy.identityId = vm.memberId;
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
                fullscreen: useFullScreen
            }).then(function (editedItem) {

                memberService.saveAddy(editedItem).then(function (success) {

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
                    vm.member.emailList.push(item);
                }
            }
            else if (type == "phone") {
                config.template = './views/app/phoneDialog.html';
                config.ContactInfoType = 3;
                config.push = function (item) {
                    vm.member.phoneList.push(item);
                }
            }
            else {
                config.template = './views/app/addressDialog.html';
                config.ContactInfoType = 1;
                config.push = function (item) {
                    vm.member.addressList.push(item);
                }
            }
            return config;
        }


        vm.removeAddress = function (type, addy, $event) {

            memberService.removeAddy(addy).then(function (success) {

                if (type == "phone") {
                    for (var i = vm.member.phoneList.length - 1; i >= 0; i--) {
                        if (vm.member.phoneList[i].contactInfoId == addy.contactInfoId)
                            vm.member.phoneList.splice(i, 1);
                    }
                }
                else if (type == "email") {
                    for (var i = vm.member.emailList.length - 1; i >= 0; i--) {
                        if (vm.member.emailList[i].contactInfoId == addy.contactInfoId)
                            vm.member.emailList.splice(i, 1);
                    }
                }
                else if (type == "address") {
                    for (var i = vm.member.addressList.length - 1; i >= 0; i--) {
                        if (vm.member.addressList[i].contactInfoId == addy.contactInfoId)
                            vm.member.addressList.splice(i, 1);
                    }
                }

            }, function (error) {
                appNotificationService.openToast("Error deleting " + type + ":  " + error);
            });
        }

        vm.openSms = function (addy, $event) {
            //<a href="sms:@(String.Format("{0:###-###-####}", double.Parse(m.Phone)))"><img class="icon32" src="~/Content/images/Text-32.png" alt="call" /></a>
            openMessage(addy, 2, $event);
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

        vm.openEmail = function (addy, $event) {
            //sendMail(addy.emailAddress);
            openMessage(addy, 1, $event);
        }

        function openMessage(addy, messageType, $event) {

            addy.messageType = messageType;

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            // show dialog passing addy as current item
            $mdDialog.show({
                locals: { currentItem: addy },
                templateUrl: './views/app/messageDialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: "MessageDialogController",
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (editedItem) {

                //memberService.saveAddy(editedItem).then(function (success) {

                //    if (editedItem.isNew)
                //        config.push(success);
                //    else
                //        angular.copy(success, addy);

                //    $log.info("Edit item saved");

                //}, function (error) {
                //    $log.info("Error saving addy");
                //});

                if (messageType == 1) {
                    // send email
                    $log.info("email sent!");
                    appNotificationService.openToast("Email sent!");
                }
                else {
                    // send sms
                    $log.info("Text sent!");
                    appNotificationService.openToast("Email sent!");
                }

            }, function () {
                $log.info("Edit item cancelled");
            });

        }

        function sendMail(email) {
            //<a href="mailto:@m.Email"><img class="icon32" src="~/Content/images/Mail-32.png" alt="email" /></a>
            //$window.open("mailto:" + email);
            $window.location.href = "mailto:" + email;
        }
        return vm;
    }]);