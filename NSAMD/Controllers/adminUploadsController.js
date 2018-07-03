

'use strict';

angular.module('app').controller('adminUploadsController',
    ['$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'config', 'appNotificationService', 'authService'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, config, appNotificationService, authService) {

            var vm = this;
            vm.selectedFile = null;
            vm.progressBarValue = 0;
            vm.progressMessage = undefined;
            vm.progressBarVisible = false;

            //https://github.com/angular/angular.js/issues/1375
            //https://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields


            vm.selectFile = function(element) {
                document.getElementById('fileUpload').click();
            }

            vm.fileSelected = function (file) {
                vm.selectedFile = file;
            }

            vm.upload = function () {

                vm.progressBarVisible = true;
                vm.progressBarValue = 0;
                vm.progressMessage = 'Uploading...';

                // For more info on XMLHttpRequest: 
                // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest

                let xhr = new XMLHttpRequest();

                xhr.upload.onloadstart = function (e) {
                    $scope.$apply(function () { 

                        vm.progressBarValue = 0;
                        vm.progressMessage = 'Uploading...';
                    });
                }

                xhr.upload.onprogress = function (e) {

                    $scope.$apply(function () { 
                        var value = (e.loaded / e.total) * 100;
                        vm.progressBarValue = value;
                    });
                }

                xhr.upload.onloadend = function (e) {
                    $scope.$apply(function () { 
                        vm.progressMessage = 'Uploading complete!  The import may take a while to complete depending on the size of the database.';
                        appNotificationService.openToast("File uploaded!");
                    });
                }

                xhr.upload.onerror = function (e) {
                    $scope.$apply(function () {
                        vm.progressMessage = 'Error uploading file';
                    });
                }

                var uri = config.apiUrl + "/uploads";
                var formData = new FormData();
                formData.append('file', vm.selectedFile, vm.selectedFile.name);

                var mgr = authService.oidcManager;
                var token = mgr.access_token;

                xhr.open('POST', uri, true);
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                xhr.send(formData);
            }

            return vm;
        }]);