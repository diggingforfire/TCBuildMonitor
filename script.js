(function(ko, moment, buzz) {
	var tcBaseUrl = getParameterByName('tcBaseUrl');
	var authToken = getParameterByName('authToken');

	var newUrl = removeURLParameter(window.location.href, 'authToken');
	window.history.pushState('newUrl', "Title", "/" + newUrl);

	var buildConfigId = getParameterByName('buildConfigId');
	var blame = getParameterByName('blame') === 'true';
	var showBuildTime = getParameterByName('showBuildTime') === 'true';
	var projectName = getParameterByName('projectName');
	var blink = getParameterByName('blink') === 'true';
	var sad = getParameterByName('sad') === 'true';

	var buildStatusEndPoint = "/app/rest/latest/buildTypes/id:" + buildConfigId + "/builds/count:1";
	var buildStatusApiUrl = tcBaseUrl + buildStatusEndPoint + "?overrideAccept=application/json";

	var trombone = new buzz.sound("sadtrombone.mp3");

	var ViewModel = function () {
		var self = this;

		self.buildStatus = ko.observable();
		self.projectName = ko.observable();
		self.offenderText = ko.observable();
		self.buildStatusText = ko.observable();
		self.buildTime = ko.observable();
		self.blink = ko.observable(blink);

		setNewBuildStatus();

		setInterval(setNewBuildStatus, 10000);

		function setNewBuildStatus() {
			getBuildInfo(function (data) {
				var oldBuildStatus = self.buildStatus();
				
				self.buildStatus(data.status);
				self.buildStatusText('BUILD ' + data.status);
				self.projectName(projectName || data.buildType.projectName);

				if (showBuildTime) {
					var startDate = moment(data.startDate, 'YYYYMMDDTHHmmssZ');
					var finishDate = moment(data.finishDate, 'YYYYMMDDTHHmmssZ');
					var elapsed = moment(finishDate.diff(startDate)).format('mm[m]:[ ]ss[s]');
					self.buildStatusText(self.buildStatusText() + ' (' + elapsed + ')');
				}
				
				if (data.status === 'FAILURE') {
					if (blame) {
						self.offenderText(data.lastChanges.change[0].username + ' broke the build');
					}

					if (oldBuildStatus === 'SUCCESS' && sad) {
						trombone.play();
					}
				} else if (data.status === 'SUCCESS') {
					if (oldBuildStatus === 'FAILURE') {
						self.offenderText('');
					}
				}

			});
		}

		function getBuildInfo(success) {
			$.ajax({
				url: buildStatusApiUrl,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + authToken);
				},
				success: success
			});
		}
	}

	function getParameterByName(name, url) {
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent(parameter)+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
        return url;
    } else {
        return url;
    }
}

	$(function () {
		var viewModel = new ViewModel();
		ko.applyBindings(viewModel);
	});
})(ko, moment, buzz);
