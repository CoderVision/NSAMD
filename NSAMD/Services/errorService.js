
'use strict'

angular.module('app').factory('errorService', ['config'
    , function (config) {

        var vm = {};

        vm.getErrorMessage = function (error) {
            var httpStatusCode = error.status;
            var httpStatusCodeText = error.statusText;
            var errorMessage = "";
            if (httpStatusCode == -1 ||
                httpStatusCode >= 500) {
                errorMessage = vm.getServerError(error, httpStatusCode, httpStatusCodeText);
            }
            else if (httpStatusCode >= 400) {
                errorMessage = vm.getClientError(error, httpStatusCode, httpStatusCodeText);
            }
            // append status code and text
            errorMessage = (errorMessage + "  (" + httpStatusCode + ")  " + httpStatusCodeText).trim() + ".  ";
            // append details
            var err = (error && (error.message || (error.data || (error.data && error.data.message))));
            if (err)
                errorMessage = errorMessage + "";
            return errorMessage.trim();
        }

        vm.getClientError = function (error, httpStatusCode, httpStatusCodeText) {
            if (httpStatusCode == 400) {
                return "The server was unable to processes this request, because it is a bad request.  Verify all of the information is correct.";
            }
            else if (httpStatusCode == 401) {
                return "You do not have permission to perform this action on the server.";
            }
            else if (httpStatusCode == 404) {
                return "The server was unable to find the resource.";
            }
            else if (httpStatusCode == 408) {
                return "The request to the server timed out, it may not be available, or may be busy processing something else, please try again.";
            }
            else {
                return null;
            }
        }
        vm.getServerError = function (error, httpStatusCode, httpStatusCodeText) {
            if (httpStatusCode == 500) {
                return "The server encountered a critical error.";
            }
            else if (httpStatusCode == -1  // angular returns -1 instead of 503
                || httpStatusCode == 503) {
                // service unavailable
                return "Unable to connect to server.";
            }
            else {
                return "An error has occurred communicating with the server."
            }
        }

        return vm;
}]);
