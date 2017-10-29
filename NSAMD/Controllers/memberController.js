

'use strict';

angular.module('app').controller('memberController',
    ['$routeParams', '$mdMedia', '$mdDialog', '$mdBottomSheet', '$location', '$log', '$window', 'memberService', 'appNotificationService'
    , function ($routeParams, $mdMedia, $mdDialog, $mdBottomSheet, $location, $log, $window, memberService, appNotificationService) {

        var vm = this;

        vm.memberId = $routeParams.memberId;
        vm.churchId = 3;

        vm.member = {};
        vm.memberList = [{ id: 4, name: "Gary Lima" }, { id: 5, name: "Wei Lima" }, { id: 6, name: "Phillip Kinson" }];
        vm.teamList = [{ id: 1, name: "Ambassadors for Christ" }, { id: 2, name: "Harvesters" }];

        // Sponsors
        vm.selectedSponsors = [vm.memberList[0]];
        vm.selectedSponsor = null;
        vm.sponsorSearchText = null;
        vm.sponsorSearch = function (sponsorSearchText) {
            //var result = vm.memberList.filter(createFilterFor(sponsorSearchText));
            var result = vm.memberList.filter(sponsorFilter);
            return result;
        }
        function sponsorFilter(member) {
            var lowercase = angular.lowercase(vm.sponsorSearchText);
            return (member.name.toLowerCase().indexOf(lowercase) === 0);
        }

        // Teams
        vm.selectedTeams = [vm.teamList[0]];
        vm.selectedTeam = null;
        vm.teamSearchText = null;
        vm.teamSearch = function (sponsorSearchText) {
            //var result = vm.memberList.filter(createFilterFor(sponsorSearchText));
            var result = vm.memberList.filter(teamFilter);
            return result;
        }
        function teamFilter(member) {
            var lowercase = angular.lowercase(vm.sponsorSearchText);
            return (member.name.toLowerCase().indexOf(lowercase) === 0);
        }

        vm.isLoading = false;

        vm.loadMember = function () {
            vm.isLoading = true;
            memberService.get(vm.memberId, vm.churchId).then(function (success) {
                vm.member = success;
                //appNotificationService.openToast("success");
            }, function (error) {
                appNotificationService.openToast("Error loading member " + vm.memberId + ":  " + error);
            }).then(function () {
                vm.isLoading = false;
            });
        };

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

                }, function (error) {
                    $log.info("Error saving addy");
                });

            }, function () {
                $log.info("Edit item cancelled");
            });
        }

        function GetEditConfiguration(type) {
            var config = {};
            config.controller = "SimpleDialogController";
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