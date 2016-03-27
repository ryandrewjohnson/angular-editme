"bundle";
(function() {
var define = System.amdDefine;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define("src/editme.js", ["github:angular/bower-angular@1.5.0.js"], function(angular) {
      return factory(angular);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'));
  } else if (angular) {
    factory(root.angular);
  }
}(this, function(angular) {
  'use strict';
  let m = angular.module('shaka-editme', []);
  m.component('skEditmeIcon', {template: `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">
        <path d="M30.173 7.542l-0.314 0.314-5.726-5.729 0.313-0.313c0 0 1.371-1.813 3.321-1.813 0.859 0 1.832 0.353 2.849 1.37 3.354 3.354-0.443 6.171-0.443 6.171zM27.979 9.737l-19.499 19.506-8.48 2.757 2.756-8.485v-0.003h0.002l19.496-19.505 0.252 0.253zM2.76 29.239l4.237-1.219-2.894-3.082-1.343 4.301z"></path>
      </svg>
    `});
  m.directive('skEditme', ($compile, $timeout) => {
    let directive = {
      require: '^form',
      scope: {
        model: '=',
        isEditing: '=?',
        hideIcon: '=?',
        onEditChange: '&?',
        onInvalid: '&?'
      },
      controller: function($scope) {
        $scope.toggleEdit = (value) => {
          $scope.isEditing = (value !== undefined) ? value : !$scope.isEditing;
        };
      },
      link: link,
      transclude: true,
      template: `
        <div ng-click="toggleEdit(true)">
          <span ng-hide="isEditing" class="model-wrapper" ng-class="{'hide-icon': hideIcon}">
            <span class="model-content" ng-class="{'edit-active': showEditHint}">{{model}}</span>
            <sk-editme-icon ng-class="{'edit-active': showEditHint}" ng-if="!isEditing && !hideIcon"></sk-editme-icon>
          </span>
          <content ng-show="isEditing"></content>
        </div>
      `
    };
    return directive;
    function link(scope, element, attrs, formCtrl, transclude) {
      let $content = element.find('content');
      let $input = undefined;
      let $static = angular.element(element[0].querySelector('.model-content'));
      const KEYS = {ENTER: 13};
      scope.showIcon = scope.showIcon || true;
      transclude(transcludeFn);
      $static.on('mouseover', () => {
        scope.showEditHint = true;
        scope.$apply();
      });
      $static.on('mouseout', () => {
        scope.showEditHint = false;
        scope.$apply();
      });
      scope.$watch(() => scope.isEditing, onIsEditingChange);
      function transcludeFn(clone, innerScope) {
        let input = Array.prototype.filter.call(clone, (el) => {
          return (el.nodeName.toLowerCase() === 'input' || el.nodeName.toLowerCase() === 'textarea');
        });
        $input = angular.element(input);
        $content.append($compile($input)(innerScope));
      }
      function onIsEditingChange(value) {
        if (value) {
          $timeout(() => $input[0].focus());
          $input.on('blur keypress', validate);
        } else {
          $input.off('blur keypress', validate);
        }
        if (scope.onEditChange) {
          scope.onEditChange({isEditing: angular.copy(value)});
        }
      }
      function validate(evt) {
        if (evt.type !== 'blur' && evt.keyCode !== KEYS.ENTER) {
          return;
        }
        let isEditing = false;
        let isModelEmpty = angular.isDefined(scope.model) ? (scope.model.search(/\w+/g) < 0) : true;
        let inputCtrl = formCtrl[$input.attr('name')];
        if (inputCtrl) {
          isEditing = inputCtrl.$invalid;
          if (inputCtrl.$invalid && scope.onInvalid) {
            scope.onInvalid({$error: angular.copy(inputCtrl.$error)});
          }
        }
        isEditing = isModelEmpty ? true : isEditing;
        scope.isEditing = isEditing;
        scope.$apply();
      }
    }
  });
  return m.name;
}));

})();
//# sourceMappingURL=editme.js.map