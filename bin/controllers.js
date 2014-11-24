'use strict';

exports.launchController = function($scope) {
  $scope.launcher = {}; 
  $scope.defaults = {
    'host' : window.location.protocol + "//" + window.location.host + '/',
    'text' : "LAUNCH ON",
    'image': "button.svg",
    'name' : "launch",
    'metrics'    : false,
    'counter'    : 0,
    'launch_host': "https://openshift.redhat.com",
    'launch_path': "/app/console/application_type/custom",
    'cartridges' : "nodejs-0.10",
    'initial_git_branch': "master",
    'initial_git_url'   : "https%3A%2F%2Fgithub.com%2Fryanj%2Flaunch-service.git"
  };
  $scope.init = function(){
    var carts = [];
    var qs_whitelist = ['text','name','initial_git_url','initial_git_branch','launch_host','launch_path','cartridges','metrics'];
    // Use available querystring values to set internal defaults
    var qs = window.location.search.slice(1).split("&");
    qs.forEach(function(param){
      var p = param.split("=");
      if( qs_whitelist.indexOf(p[0]) >= 0){
        $scope.defaults[p[0]] = p[1];
        $scope.launcher[p[0]] = p[1];
        qs_whitelist.splice(qs_whitelist.indexOf(p[0]),1);
      }else if( p[0] == 'cartridges[]'){
        //Allow multiple "cartridges[]" params
        // OR one "cartridges" param containing CSV
        carts.push(p[1]);
      }
    });
    if(carts.length > 0){
      // coerce multiple "cartridges[]" to CSV internally
      $scope.defaults.cartridges = carts.join(',');
    }
    // Set the remaining launcher internals to their default values:
    qs_whitelist.push('host');
    qs_whitelist.push('counter');
    qs_whitelist.forEach(function(param){
      $scope.launcher[param] = $scope.defaults[param];
    });
    $scope.launcher.metrics = ( $scope.launcher.metrics == "true") ? true : false;
    $scope.launcher.metrics_controls = ( $scope.defaults.metrics == "true") ? true : false;
    $scope.defaults.url=$scope.getLaunchUrl();
    $scope.launcher.url=$scope.defaults.url;
  };
  $scope.createLaunchUrl = function(launch_host, launch_path, cartridges, initial_git_url, initial_git_branch, name, metrics){
    var url = '';
    var carts = '?';
    var cart_params = cartridges.split(',');
    cart_params.forEach(function(cart){
      carts += 'cartridges[]='+cart+'&';
    });
    //if(metrics){
    url = launch_host+launch_path+carts+"initial_git_url="+initial_git_url+"&name="+name;
    //}else ...
    if(initial_git_branch !== "master"){
      url+="&initial_git_branch="+initial_git_branch
    }
    return url 
  }
  $scope.getUrl = function(){
    return $scope.launcher.url || $scope.defaults.url;
  };
  $scope.getLaunchUrl = function(){
    return $scope.createLaunchUrl(
      $scope.launcher.launch_host || $scope.defaults.launch_host,
      $scope.launcher.launch_path || $scope.defaults.launch_path,
      $scope.launcher.cartridges || $scope.defaults.cartridges,
      $scope.launcher.initial_git_url || $scope.defaults.initial_git_url,
      $scope.launcher.initial_git_branch || $scope.defaults.initial_git_branch,
      $scope.launcher.name || $scope.defaults.name,
      $scope.launcher.metrics
    );
  };
  $scope.getText = function() {
    return $scope.launcher.text || $scope.defaults.text;
  };
  $scope.getAltText = function(){
    return $scope.getText() + " OpenShift";
  }
  $scope.getImage = function(){
    return $scope.defaults.host + 'button/'+ $scope.getText() +'.svg'
  }
  $scope.getMarkdown = function(){
    return "[!["+$scope.getAltText()+"]("+$scope.getImage()+")]("+$scope.getUrl()+")";
  };
  $scope.getHtml = function(){
    return "<a href=\"" + $scope.getUrl() + "\"><img alt=\"" + $scope.getAltText() + "\" src=\"" + $scope.getImage() + "\" /></a>";
  };
  $scope.init()
};