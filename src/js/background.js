chrome.webRequest.onHeadersReceived.addListener(function(details)
{
	var isCsv = false;
	_.each(details.responseHeaders, function(header)
	{
		if (header.name.toLowerCase() == "content-type" && header.value.toLowerCase() == "text/csv")
		{
			isCsv = true;
			return;
		}
	});

	if (isCsv)
	{
		_.each(details.responseHeaders, function(header, i)
		{
			if (header.name.toLowerCase() == "content-disposition")
			{
				details.responseHeaders[i].name = "X-Old-Content-Disposition";
			}

			if (header.name.toLowerCase() == "content-type")
			{
				details.responseHeaders[i].name = "X-Old-Content-Type";
			}
		});

		var headers = _.extend([], details.responseHeaders, [
			{
				name: "Content-Disposition",
				value: "inline"
			},
			{
				name: "Content-Type",
				value: "text/html"
			}
		]);

		chrome.tabs.executeScript(null, {
			file: "js/jquery-2.1.0.min.js",
			runAt: "document_start"
		});

		chrome.tabs.executeScript(null, {
			file: "js/underscore-1.5.2.min.js",
			runAt: "document_start"
		});

		chrome.tabs.executeScript(null, {
			file: "js/csv_parser.js",
			runAt: "document_start"
		});

		chrome.tabs.executeScript(null, {
			file: "js/less-1.6.1.min.js",
			runAt: "document_end"
		});

		return { responseHeaders: headers };
	}

}, {urls: ["<all_urls>"]}, ["blocking", "responseHeaders"]);
