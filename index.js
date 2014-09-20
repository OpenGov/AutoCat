var url = require('url');


var express = require('express');
var _ = require('lodash');



var app = express();



app.set('view engine', 'hjs');
app.set('views', __dirname + '/views');


app.use(function (req, res, next) {
  req.ogApi = new OgApi({
    url: settings.ogApiUrl,
    accessToken: settings.ogApiToken,
    cookie: req.get('Cookie')
  });

  res.renderError = function (opts) {
    opts = opts || {};

    res.status(opts.status || 500).render('error', {
      message: opts.message,
      stylesheet: assetUrl('stylesheets/athena.css'),
      partials: {content: opts.content || ('' + opts.status)}
    });
  };

  res.renderReport = function (opts) {
    opts = opts || {};

    var athenaStylesheet;

    if (settings.enableEntityColors && req.entity.color.index) {
      athenaStylesheet = 'athena-' + req.entity.color.index + '.css';
    } else {
      athenaStylesheet = 'athena.css';
    }

    res.render('index', {
      entryScript: assetUrl('javascripts/index.js'),
      ie8CompatJs: assetUrl('javascripts/ie8compat.js'),
      athenaStyles: assetUrl('stylesheets/' + athenaStylesheet),

      entityName: _str.capitalize(req.entity.name),

      frontendSentryDSN: settings.frontendSentryDSN,

      gon: JSON.stringify({
        standalone: true,
        asset_path: url.resolve(settings.assetHost, settings.assetPath),
        asset_manifest: require('./asset_helpers').manifest,
        config: {
          ogApiToken: settings.ogApiToken
        },
        entity: req.entity,
        reports: req.reports,
        defaultReport: opts.defaultReport,
        dataApi: req.query.api
      })
    });
  };

  next();
});



app.get('/', function (req, res) {
  if (req.method === 'HEAD') {
    // Health check from the load balancer.
    return res.send('OK');
  }

  res.redirect('/transparency');
});

app.get('/transparency', loadEntity, loadReports, function(req, res) {
  res.renderReport();
});

app.get('/data', loadEntity, loadReports, function (req, res) {
  var defaultReport = _.find(req.reports, {report_type: 'grid'});

  if (!defaultReport) {
    return res.renderError({
      content: 'entity_not_found',
      status: 404
    });
  }

  res.renderReport({
    defaultReport: defaultReport.id
  });
});

app.use(raven.middleware.express(ravenClient));

app.use(function (err, req, res, next) {
  res.renderError({
    status: 500
  });
});

if (require.main === module) {
  app.listen(settings.httpPort);
}