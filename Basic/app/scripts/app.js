'use strict';
angular
  .module('basic', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'ngFileUpload',
    "isteven-multi-select",
    "dndLists",
    'ui.bootstrap',
    'ui-notification',
    'angularSpinner',
    'ngCookies',
    'ui.select',
    'toggle-switch',
    'cfp.hotkeys',
    'ui.bootstrap.datetimepicker',
    'angularMoment',
    'chart.js',
    'ui.router',
    'ui.router.state.events'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    var states = [
      {name: 'main', url: '/', templateUrl: "views/main.html", controller: 'MainCtrl'},

      {name: 'home', url: '/home', templateUrl: "views/dashboard.html"},
      {
        name: 'dataExplore',
        url: '/explore',
        templateUrl: 'views/dataExplore/dataExplore.html',
        controller: 'DataExploreCtrl'
      },
      {name: 'data', url: '/data/{name}', templateUrl: 'views/dataExplore/data.html', controller: 'DataCtrl'},
      {name: 'console.taskSchedule', url: '/schedule', templateUrl: 'views/dashboard.html', controller: 'DashboardCtrl'},
      {name: 'console.settings', url: '/settings', templateUrl: 'views/settings.html', controller: 'SettingsCtrl'}
    ];
    // Loop over the state definitions and register them
    states.forEach(function (state) {
      $stateProvider.state(state);
    });
  })
  .config(['$translateProvider', '$windowProvider', function ($translateProvider, $windowProvider) {
    let window = $windowProvider.$get();
    let lang = window.navigator.userLanguage || window.navigator.language;
    console.log("lang", lang);
    if (lang) {
      lang = lang.substr(0, 2);
      $translateProvider.preferredLanguage(lang);
    }
  }])
  .config(['NotificationProvider','usSpinnerConfigProvider', '$httpProvider', 'ChartJsProvider', function (NotificationProvider, usSpinnerConfigProvider, $httpProvider, ChartJsProvider) {
    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
    usSpinnerConfigProvider.setDefaults({color: 'orange', radius: 20});

    ChartJsProvider.setOptions({
      chartColors: ['#4da9ff','#79d2a6','#ff9900','#ff704d','#669999','#4d0000']
    });
  }])
  .run(['$rootScope', '$location', '$state', '$http', function ($rootScope, $location, $state, $http) {
      // $rootScope.$on('$stateChangeStart', function (event,toState) {
      //   console.log(toState.name);
      //   if(toState && toState.name === 'main'){
      //     $('#navbar-nav').css('visibility','hidden');
      //   }else{
      //     $('#navbar-nav').css('visibility','visible');
      //   }
      // })

    $rootScope.login = (username ,password) => {
      $http.post("/api/user/login/" ,{username,password}).success(function (user) {
        if (user.status) {
          console.log("LOGIN 1");
          $location.path("/home");
          // $cookies.put("username", username);
          // $cookies.put("token", user.token);
          // if($rootScope.isAdmin()) {
          //   $location.path("/dashboard");
          // }else{
          //   $location.path("/task_management");
          // }
          // $rootScope.styles = null;
          // $rootScope.message = null;
          // $rootScope.changeTab('task');
        } else {
          console.log("LOGIN 2");
          // $rootScope.message = $filter('translate')('ocsp_web_user_manage_005');
          // $rootScope.styles = "redBlock";
          // $cookies.remove("username");
        }
      }).error(function(err){
        $rootScope.message = err;
      });
    };

    }])
    .service('buildLog', ['$uibModal', function ($uibModal) {
      this.open = function (tit,cont) {
        return $uibModal.open({
          backdrop: 'static',
          templateUrl: 'views/layer/dataExplore.html',
          // size: 'size',
          controller: ['$scope','$filter','$uibModalInstance',
            function ($scope,$filter,$uibModalInstance) {
              $scope.tit = $filter('translate')('web_common_data_explore_019');
              $scope.cont = $filter('translate')('web_common_data_explore_020');
              $scope.create = $filter('translate')('web_common_015');
              $scope.createName ='';
              $scope.cancel = function () {
                $uibModalInstance.dismiss();
              };
            }]
        }).result;
      };

    }])
    .service('openPreview', ['$uibModal','$http', function ($uibModal, $http) {
    this.open = function (resultPreview) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/savePreview.html',
        // size: 'size',
        //controllerUrl: 'scripts/layer/savePreview.js',
        controller: ['$scope','$filter','$uibModalInstance',
          function ($scope,$filter,$uibModalInstance) {
            $scope.preTil = $filter('translate')('web_common_017');
            $scope.savebtn = $filter('translate')('web_common_018');
            $scope.resultPreview = resultPreview;
            $scope.save = function () {
              $http.get('/api/jupyter/step5').success(function(data){
                  console.log("DataProcessingCtrl save:", data.result);
              });
              $uibModalInstance.dismiss();
            };
          }]
      }).result;
    };

  }])
