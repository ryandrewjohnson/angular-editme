(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) {
    define(['angular'], function (angular) {
      return factory(angular);
    });
  }
  // Node.js
  else if (typeof exports === 'object') {
    module.exports = factory(require('angular'));
  }
  // Angular
  else if (angular) {
    factory(root.angular);
  }
}(window, function (angular) {
  'use strict';

  let m = angular.module('shaka-editme', []);

  /**
   * Component wrapper for SVG edit icon
   */
  m.component('skEditmeIcon', {
    template: `
      <div class="icon-wrapper">
        edit-icon
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">
          <path d="M30.173 7.542l-0.314 0.314-5.726-5.729 0.313-0.313c0 0 1.371-1.813 3.321-1.813 0.859 0 1.832 0.353 2.849 1.37 3.354 3.354-0.443 6.171-0.443 6.171zM27.979 9.737l-19.499 19.506-8.48 2.757 2.756-8.485v-0.003h0.002l19.496-19.505 0.252 0.253zM2.76 29.239l4.237-1.219-2.894-3.082-1.343 4.301z"></path>
        </svg>
      </div>
    `
  })


  m.directive('skEditme', ($compile, $timeout) => {
    let directive = {
      scope : {
        isEditing: '=?',
        hideIcon: '=?',
        allowEnterKey: '=?',
        onStateChange: '&?',
        onInvalid: '&?',
        onChange: '&?'
      },
      controller: function($scope) {
        $scope.toggleEdit = (value) => {
          $scope.isEditing = (value !== undefined) ? value : !$scope.isEditing;
        };
      },
      link: link,
      transclude: {
        static: '?static',
        editable: '?editable'
      },
      template: `
        <div ng-click="toggleEdit(true)" ng-class="{'editme-touch': isTouchEnabled}">
          <span ng-hide="isEditing" class="model-wrapper" ng-class="{'hide-icon': hideIcon}">
            <span class="model-content" ng-transclude="static">{{model}}</span>
            <sk-editme-icon ng-if="!isEditing && !hideIcon"></sk-editme-icon>
          </span>
          <div ng-transclude="editable" ng-show="isEditing"></div>
        </div>
      `
    };

    return directive;

    function link(scope, element, attrs, ctrl, transclude) {
      let $input    = undefined;
      let ngModel   = undefined;
      let prevValue = undefined;
      const KEYS    = {
        ENTER: 13
      };
      const VALID_ELEMENTS = [
        'input[type="text"]',
        'input[type="url"]',
        'input[type="date"]',
        'input[type="email"]',
        'input[type="week"]',
        'input[type="month"]',
        'input[type="number"]',
        'input[type="time"]',
        'textarea'
      ];

      if ('ontouchstart' in document.documentElement) {
        scope.isTouchEnabled = true;
      }

      scope.showIcon  = scope.showIcon || true;
      scope.allowEnterKey = scope.allowEnterKey || false;

      $timeout(() => {
        // This will ensure only valid elements are matched
        let input = element[0].querySelectorAll(VALID_ELEMENTS.join(','));

        if (input.length !== 1) {
          throw new Error('skEditme could not find valid input or textarea element. Please see docs for valid element types.');
        }

        $input = angular.element(input[0]);
        ngModel = $input.controller('ngModel');

        if (angular.isUndefined(ngModel)) {
          throw new Error('skEditme transcluded element is missing required ng-model directive');
        }
        //throw error/warning if invalid element provided

        // ngModel.$modelView will be initialized as NaN
        // This ensures we don't initiate our scope.model with NaN
        let disconnect = scope.$watch(() => ngModel.$modelValue, (value) => {
          // isNaN doesn't work see http://stackoverflow.com/questions/2652319/how-do-you-check-that-a-number-is-nan-in-javascript
          let isNotNum = (value !== value);

          if (!isNotNum) {
            scope.model = value;
            scope.$watch(() => scope.isEditing, onIsEditingChange);
            disconnect();
          }
        });

        ngModel.$viewChangeListeners.push(() => {
          scope.model = ngModel.$modelValue
        });
      });

      function onIsEditingChange(value) {
        if (value) {
          $timeout(() => $input[0].focus());
          prevValue = angular.copy(scope.model);
          $input.on('blur keypress', validate);
        }
        else {
          $input.off('blur keypress', validate);
        }

        if (scope.onStateChange && value !== undefined) {
          scope.onStateChange({$isEditing: angular.copy(value)});
        }

        if (scope.onChange &&
            value === false &&
            prevValue !== undefined &&
            prevValue !== scope.model) {
          scope.onChange({$value: angular.copy(scope.model)});
        }
      }

      function validate(evt) {
        if (evt.type === 'blur' ||
            (evt.keyCode === KEYS.ENTER && !scope.allowEnterKey)) {
          scope.isEditing = ngModel.$invalid && ngModel.$dirty;
          scope.$apply();

          if (ngModel.$error && scope.onInvalid) {
            scope.onInvalid({$error: angular.copy(ngModel.$error)});
          }
        }
      }
    }
  });

  return m.name;
}));
