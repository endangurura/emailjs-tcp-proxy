"use strict";

var _cluster = _interopRequireDefault(require("cluster"));

var _npmlog = _interopRequireDefault(require("npmlog"));

var _proxy = _interopRequireDefault(require("./proxy"));

var _morgan = _interopRequireDefault(require("morgan"));

var _express = _interopRequireDefault(require("express"));

var _http = require("http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var LOG_FORMAT = ':remote-addr [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';
_npmlog["default"].level = 'silly';
var port = process.env.PROXY_PORT || 8888;

var exit = function exit(signal, exitCode) {
  return function () {
    _npmlog["default"].warn('exit', "Exited on ".concat(signal));

    process.exit(exitCode);
  };
};

process.on('SIGINT', exit('SIGINT', 1));
process.on('SIGUSR1', exit('SIGUSR1', 1));
process.on('SIGUSR2', exit('SIGUSR2', 1));
process.on('uncaughtException', exit('Uncaught exception', 1));
process.on('SIGTERM', exit('SIGTERM', 0));
process.on('SIGINT', exit('SIGINT', 0));
process.on('uncaughtException', exit('uncaughtException', 1));
process.on('exit', function () {
  if (_cluster["default"].isMaster) {
    for (var id in _cluster["default"].workers) {
      _cluster["default"].workers[id].kill();
    }
  }

  exit(0)();
});

if (_cluster["default"].isMaster) {
  _cluster["default"].on('fork', function (worker) {
    _npmlog["default"].info('cluster', 'Forked worker #%s [pid:%s]', worker.id, worker.process.pid);
  });

  _cluster["default"].on('exit', function (worker) {
    _npmlog["default"].warn('cluster', 'Worker #%s [pid:%s] died', worker.id, worker.process.pid);

    setTimeout(function () {
      _cluster["default"].fork();
    }, 1000);
  });

  _cluster["default"].fork();
} else {
  var app = (0, _express["default"])();
  var server = (0, _http.Server)(app);
  app.disable('x-powered-by');
  app.use((0, _morgan["default"])(LOG_FORMAT, {
    stream: {
      write: function write() {
        var line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return line.trim() && _npmlog["default"].http('express', line);
      }
    }
  }));
  server.listen(port, function () {
    var _server$address = server.address(),
        address = _server$address.address,
        port = _server$address.port;

    (0, _proxy["default"])(server, _npmlog["default"]);

    _npmlog["default"].info('express', 'Server listening on %s:%s', address, port);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOlsiTE9HX0ZPUk1BVCIsImxvZyIsImxldmVsIiwicG9ydCIsInByb2Nlc3MiLCJlbnYiLCJQUk9YWV9QT1JUIiwiZXhpdCIsInNpZ25hbCIsImV4aXRDb2RlIiwid2FybiIsIm9uIiwiY2x1c3RlciIsImlzTWFzdGVyIiwiaWQiLCJ3b3JrZXJzIiwia2lsbCIsIndvcmtlciIsImluZm8iLCJwaWQiLCJzZXRUaW1lb3V0IiwiZm9yayIsImFwcCIsInNlcnZlciIsImRpc2FibGUiLCJ1c2UiLCJzdHJlYW0iLCJ3cml0ZSIsImxpbmUiLCJ0cmltIiwiaHR0cCIsImxpc3RlbiIsImFkZHJlc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxVQUFVLEdBQUcsaUdBQW5CO0FBRUFDLG1CQUFJQyxLQUFKLEdBQVksT0FBWjtBQUNBLElBQU1DLElBQUksR0FBR0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFVBQVosSUFBMEIsSUFBdkM7O0FBRUEsSUFBTUMsSUFBSSxHQUFHLFNBQVBBLElBQU8sQ0FBQ0MsTUFBRCxFQUFTQyxRQUFUO0FBQUEsU0FBc0IsWUFBTTtBQUN2Q1IsdUJBQUlTLElBQUosQ0FBUyxNQUFULHNCQUE4QkYsTUFBOUI7O0FBQ0FKLElBQUFBLE9BQU8sQ0FBQ0csSUFBUixDQUFhRSxRQUFiO0FBQ0QsR0FIWTtBQUFBLENBQWI7O0FBS0FMLE9BQU8sQ0FBQ08sRUFBUixDQUFXLFFBQVgsRUFBcUJKLElBQUksQ0FBQyxRQUFELEVBQVcsQ0FBWCxDQUF6QjtBQUNBSCxPQUFPLENBQUNPLEVBQVIsQ0FBVyxTQUFYLEVBQXNCSixJQUFJLENBQUMsU0FBRCxFQUFZLENBQVosQ0FBMUI7QUFDQUgsT0FBTyxDQUFDTyxFQUFSLENBQVcsU0FBWCxFQUFzQkosSUFBSSxDQUFDLFNBQUQsRUFBWSxDQUFaLENBQTFCO0FBQ0FILE9BQU8sQ0FBQ08sRUFBUixDQUFXLG1CQUFYLEVBQWdDSixJQUFJLENBQUMsb0JBQUQsRUFBdUIsQ0FBdkIsQ0FBcEM7QUFDQUgsT0FBTyxDQUFDTyxFQUFSLENBQVcsU0FBWCxFQUFzQkosSUFBSSxDQUFDLFNBQUQsRUFBWSxDQUFaLENBQTFCO0FBQ0FILE9BQU8sQ0FBQ08sRUFBUixDQUFXLFFBQVgsRUFBcUJKLElBQUksQ0FBQyxRQUFELEVBQVcsQ0FBWCxDQUF6QjtBQUNBSCxPQUFPLENBQUNPLEVBQVIsQ0FBVyxtQkFBWCxFQUFnQ0osSUFBSSxDQUFDLG1CQUFELEVBQXNCLENBQXRCLENBQXBDO0FBQ0FILE9BQU8sQ0FBQ08sRUFBUixDQUFXLE1BQVgsRUFBbUIsWUFBTTtBQUN2QixNQUFJQyxvQkFBUUMsUUFBWixFQUFzQjtBQUNwQixTQUFLLElBQUlDLEVBQVQsSUFBZUYsb0JBQVFHLE9BQXZCLEVBQWdDO0FBQzlCSCwwQkFBUUcsT0FBUixDQUFnQkQsRUFBaEIsRUFBb0JFLElBQXBCO0FBQ0Q7QUFDRjs7QUFDRFQsRUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSjtBQUNELENBUEQ7O0FBU0EsSUFBSUssb0JBQVFDLFFBQVosRUFBc0I7QUFDcEJELHNCQUFRRCxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVTSxNQUFWLEVBQWtCO0FBQ25DaEIsdUJBQUlpQixJQUFKLENBQVMsU0FBVCxFQUFvQiw0QkFBcEIsRUFBa0RELE1BQU0sQ0FBQ0gsRUFBekQsRUFBNkRHLE1BQU0sQ0FBQ2IsT0FBUCxDQUFlZSxHQUE1RTtBQUNELEdBRkQ7O0FBSUFQLHNCQUFRRCxFQUFSLENBQVcsTUFBWCxFQUFtQixVQUFVTSxNQUFWLEVBQWtCO0FBQ25DaEIsdUJBQUlTLElBQUosQ0FBUyxTQUFULEVBQW9CLDBCQUFwQixFQUFnRE8sTUFBTSxDQUFDSCxFQUF2RCxFQUEyREcsTUFBTSxDQUFDYixPQUFQLENBQWVlLEdBQTFFOztBQUNBQyxJQUFBQSxVQUFVLENBQUMsWUFBTTtBQUFFUiwwQkFBUVMsSUFBUjtBQUFnQixLQUF6QixFQUEyQixJQUEzQixDQUFWO0FBQ0QsR0FIRDs7QUFLQVQsc0JBQVFTLElBQVI7QUFDRCxDQVhELE1BV087QUFDTCxNQUFNQyxHQUFHLEdBQUcsMEJBQVo7QUFDQSxNQUFNQyxNQUFNLEdBQUcsa0JBQU9ELEdBQVAsQ0FBZjtBQUNBQSxFQUFBQSxHQUFHLENBQUNFLE9BQUosQ0FBWSxjQUFaO0FBQ0FGLEVBQUFBLEdBQUcsQ0FBQ0csR0FBSixDQUFRLHdCQUFPekIsVUFBUCxFQUFtQjtBQUN6QjBCLElBQUFBLE1BQU0sRUFBRTtBQUFFQyxNQUFBQSxLQUFLLEVBQUU7QUFBQSxZQUFDQyxJQUFELHVFQUFRLEVBQVI7QUFBQSxlQUFlQSxJQUFJLENBQUNDLElBQUwsTUFBZTVCLG1CQUFJNkIsSUFBSixDQUFTLFNBQVQsRUFBb0JGLElBQXBCLENBQTlCO0FBQUE7QUFBVDtBQURpQixHQUFuQixDQUFSO0FBR0FMLEVBQUFBLE1BQU0sQ0FBQ1EsTUFBUCxDQUFjNUIsSUFBZCxFQUFvQixZQUFZO0FBQzlCLDBCQUEwQm9CLE1BQU0sQ0FBQ1MsT0FBUCxFQUExQjtBQUFBLFFBQVFBLE9BQVIsbUJBQVFBLE9BQVI7QUFBQSxRQUFpQjdCLElBQWpCLG1CQUFpQkEsSUFBakI7O0FBQ0EsMkJBQVlvQixNQUFaLEVBQW9CdEIsa0JBQXBCOztBQUNBQSx1QkFBSWlCLElBQUosQ0FBUyxTQUFULEVBQW9CLDJCQUFwQixFQUFpRGMsT0FBakQsRUFBMEQ3QixJQUExRDtBQUNELEdBSkQ7QUFLRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbHVzdGVyIGZyb20gJ2NsdXN0ZXInXG5pbXBvcnQgbG9nIGZyb20gJ25wbWxvZydcbmltcG9ydCBhdHRhY2hQcm94eSBmcm9tICcuL3Byb3h5J1xuaW1wb3J0IG1vcmdhbiBmcm9tICdtb3JnYW4nXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaHR0cCdcblxuY29uc3QgTE9HX0ZPUk1BVCA9ICc6cmVtb3RlLWFkZHIgWzpkYXRlXSBcIjptZXRob2QgOnVybCBIVFRQLzpodHRwLXZlcnNpb25cIiA6c3RhdHVzIDpyZXNbY29udGVudC1sZW5ndGhdIFwiOnJlZmVycmVyXCInXG5cbmxvZy5sZXZlbCA9ICdzaWxseSdcbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QUk9YWV9QT1JUIHx8IDg4ODhcblxuY29uc3QgZXhpdCA9IChzaWduYWwsIGV4aXRDb2RlKSA9PiAoKSA9PiB7XG4gIGxvZy53YXJuKCdleGl0JywgYEV4aXRlZCBvbiAke3NpZ25hbH1gKVxuICBwcm9jZXNzLmV4aXQoZXhpdENvZGUpXG59XG5cbnByb2Nlc3Mub24oJ1NJR0lOVCcsIGV4aXQoJ1NJR0lOVCcsIDEpKVxucHJvY2Vzcy5vbignU0lHVVNSMScsIGV4aXQoJ1NJR1VTUjEnLCAxKSlcbnByb2Nlc3Mub24oJ1NJR1VTUjInLCBleGl0KCdTSUdVU1IyJywgMSkpXG5wcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIGV4aXQoJ1VuY2F1Z2h0IGV4Y2VwdGlvbicsIDEpKVxucHJvY2Vzcy5vbignU0lHVEVSTScsIGV4aXQoJ1NJR1RFUk0nLCAwKSlcbnByb2Nlc3Mub24oJ1NJR0lOVCcsIGV4aXQoJ1NJR0lOVCcsIDApKVxucHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBleGl0KCd1bmNhdWdodEV4Y2VwdGlvbicsIDEpKVxucHJvY2Vzcy5vbignZXhpdCcsICgpID0+IHtcbiAgaWYgKGNsdXN0ZXIuaXNNYXN0ZXIpIHtcbiAgICBmb3IgKHZhciBpZCBpbiBjbHVzdGVyLndvcmtlcnMpIHtcbiAgICAgIGNsdXN0ZXIud29ya2Vyc1tpZF0ua2lsbCgpXG4gICAgfVxuICB9XG4gIGV4aXQoMCkoKVxufSlcblxuaWYgKGNsdXN0ZXIuaXNNYXN0ZXIpIHtcbiAgY2x1c3Rlci5vbignZm9yaycsIGZ1bmN0aW9uICh3b3JrZXIpIHtcbiAgICBsb2cuaW5mbygnY2x1c3RlcicsICdGb3JrZWQgd29ya2VyICMlcyBbcGlkOiVzXScsIHdvcmtlci5pZCwgd29ya2VyLnByb2Nlc3MucGlkKVxuICB9KVxuXG4gIGNsdXN0ZXIub24oJ2V4aXQnLCBmdW5jdGlvbiAod29ya2VyKSB7XG4gICAgbG9nLndhcm4oJ2NsdXN0ZXInLCAnV29ya2VyICMlcyBbcGlkOiVzXSBkaWVkJywgd29ya2VyLmlkLCB3b3JrZXIucHJvY2Vzcy5waWQpXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IGNsdXN0ZXIuZm9yaygpIH0sIDEwMDApXG4gIH0pXG5cbiAgY2x1c3Rlci5mb3JrKClcbn0gZWxzZSB7XG4gIGNvbnN0IGFwcCA9IGV4cHJlc3MoKVxuICBjb25zdCBzZXJ2ZXIgPSBTZXJ2ZXIoYXBwKVxuICBhcHAuZGlzYWJsZSgneC1wb3dlcmVkLWJ5JylcbiAgYXBwLnVzZShtb3JnYW4oTE9HX0ZPUk1BVCwge1xuICAgIHN0cmVhbTogeyB3cml0ZTogKGxpbmUgPSAnJykgPT4gbGluZS50cmltKCkgJiYgbG9nLmh0dHAoJ2V4cHJlc3MnLCBsaW5lKSB9XG4gIH0pKVxuICBzZXJ2ZXIubGlzdGVuKHBvcnQsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCB7IGFkZHJlc3MsIHBvcnQgfSA9IHNlcnZlci5hZGRyZXNzKClcbiAgICBhdHRhY2hQcm94eShzZXJ2ZXIsIGxvZylcbiAgICBsb2cuaW5mbygnZXhwcmVzcycsICdTZXJ2ZXIgbGlzdGVuaW5nIG9uICVzOiVzJywgYWRkcmVzcywgcG9ydClcbiAgfSlcbn1cbiJdfQ==