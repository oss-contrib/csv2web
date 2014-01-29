$(document).ready(function()
{
	var contents = $('body').html();
	$('body').html('');

	// determine the line ending used
	var line_ending = determineLineEnding(contents);

	var table = [];
	var content_rows = contents.split(line_ending);
	delete contents;

	_.each(content_rows, function(row)
	{
		var cells = parseRow(row, ",", '"');
		table.push(cells);
	});

	var page_tpl = _.template('<!DOCTYPE html><html><head><link href="' + chrome.extension.getURL("less/style.less") + ' /><body></body></html>');

	var tpl = _.template('<table id="csv2chrome" width="100%">' +
							'<% _.each(table, function(row, i) { var ele = (i == 0? "th" : "td"); %>' +
							'<tr><% _.each(row, function(cell, i) { %><<%=ele %>><%- cell %></<%=ele %>><% }); %></tr>' +
							'<% }); %></table>'
	);

	$('head').append($('<link href="' + chrome.extension.getURL("less/style.less") + '" type="text/css" rel="stylesheet/less" />'));
	$('body').append(tpl({table: table}));
});

function determineLineEnding(contents)
{
	var cnts = {
		"\n": 0,
		"\r": 0,
		"\r\n": 0
	};

	_.each(cnts, function(v, le)
	{
		var i = -1;

		do
		{
			i = contents.indexOf(le, i + 1);
			if (i >= 0)
			{
				cnts[le]++;
			}
		}
		while (i >= 0 && i < contents.length);
	});

	var max = 0, max_le = "";
	_.each(cnts, function(v, le)
	{
		if (v > max)
		{
			max_le = le;
			max = v;
		}
	});

	return max_le;
}

function parseRow(str, sep, enc)
{
	var row = [], cell = "", i = 0, working = "";
	while (i < str.length)
	{
		var next_sep = str.indexOf(sep, i);
		var next_enc = str.indexOf(enc, i);

		if (next_sep == -1)
		{
			next_sep = str.length;
		}

		if (next_enc == -1)
		{
			next_enc = str.length;
		}

		if (next_enc < next_sep)
		{
			working = working + str.substring(i, next_enc);
			next_enc = str.indexOf(enc, i + 1);
			working = working + str.substring(i + 1, next_enc);
			i = next_enc;
		}
		else
		{
			working = working + str.substring(i, next_sep);
			row.push(working);
			working = "";
			i = next_sep;
		}

		i++;
	}

	return row;
}
