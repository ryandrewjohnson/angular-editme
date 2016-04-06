'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) {
    define(['angular'], function (angular) {
      return factory(angular);
    });
  }
  // Node.js
  else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
      module.exports = factory(require('angular'));
    }
    // Angular
    else if (angular) {
        factory(root.angular);
      }
})(window, function (angular) {
  'use strict';

  var m = angular.module('shaka-editme', []);

  /**
   * Component wrapper for SVG edit icon
   */
  m.component('skEditmeIcon', {
    template: '\n      <div class="icon-wrapper">\n        edit-icon\n        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">\n          <path d="M30.173 7.542l-0.314 0.314-5.726-5.729 0.313-0.313c0 0 1.371-1.813 3.321-1.813 0.859 0 1.832 0.353 2.849 1.37 3.354 3.354-0.443 6.171-0.443 6.171zM27.979 9.737l-19.499 19.506-8.48 2.757 2.756-8.485v-0.003h0.002l19.496-19.505 0.252 0.253zM2.76 29.239l4.237-1.219-2.894-3.082-1.343 4.301z"></path>\n        </svg>\n      </div>\n    '
  });

  m.directive('skEditme', function ($compile, $timeout) {
    var directive = {
      scope: {
        isEditing: '=?',
        hideIcon: '=?',
        onStateChange: '&?',
        onInvalid: '&?',
        onChange: '&?'
      },
      controller: function controller($scope) {
        $scope.toggleEdit = function (value) {
          $scope.isEditing = value !== undefined ? value : !$scope.isEditing;
        };
      },
      link: link,
      transclude: true,
      template: '\n        <div ng-click="toggleEdit(true)" ng-class="{\'editme-touch\': isTouchEnabled}">\n          <span ng-hide="isEditing" class="model-wrapper" ng-class="{\'hide-icon\': hideIcon}">\n            <span class="model-content" ng-class="{\'edit-active\': showEditHint}">{{model}}</span>\n            <sk-editme-icon ng-class="{\'edit-active\': showEditHint}" ng-if="!isEditing && !hideIcon"></sk-editme-icon>\n          </span>\n          <content ng-show="isEditing"></content>\n        </div>\n      '
    };

    return directive;

    function link(scope, element, attrs, ctrl, transclude) {
      var $content = element.find('content');
      var $input = undefined;
      var ngModel = undefined;
      var prevValue = undefined;
      var $static = angular.element(element[0].querySelector('.model-content'));
      var KEYS = {
        ENTER: 13
      };
      var VALID_INPUT_TYPES = ['text', 'url', 'date', 'email', 'week', 'month', 'number', 'time'];

      if ('ontouchstart' in document.documentElement) {
        scope.isTouchEnabled = true;
      }

      scope.showIcon = scope.showIcon || true;

      transclude(transcludeFn);

      $static.on('mouseover', function () {
        scope.showEditHint = true;
        scope.$apply();
      });

      $static.on('mouseout', function () {
        scope.showEditHint = false;
        scope.$apply();
      });

      function transcludeFn(clone, innerScope) {
        var inputTypePattern = new RegExp(VALID_INPUT_TYPES.join('|'), 'gi');

        // This will ensure only valid elements are matched
        var input = Array.prototype.filter.call(clone, function (el) {
          var isInputEl = el.nodeName.toLowerCase() === 'input';
          var isTextareaEl = el.nodeName.toLowerCase() === 'textarea';

          if (isTextareaEl) {
            return true;
          }

          if (isInputEl) {
            var type = el.getAttribute('type') || '';
            return type.search(inputTypePattern) > -1;
          }

          return false;
        });

        $input = angular.element(input);

        if (!$input.length || $input.length > 1) {
          throw new Error('skEditme could not find valid input or textarea element. Please see docs for valid element types.');
        }

        $content.append($compile($input)(innerScope));

        ngModel = $input.controller('ngModel');

        if (angular.isUndefined(ngModel)) {
          throw new Error('skEditme transcluded element is missing required ng-model directive');
        }
        //throw error/warning if invalid element provided

        // ngModel.$modelView will be initialized as NaN
        // This ensures we don't initiate our scope.model with NaN
        var disconnect = scope.$watch(function () {
          return ngModel.$modelValue;
        }, function (value) {
          // isNaN doesn't work see http://stackoverflow.com/questions/2652319/how-do-you-check-that-a-number-is-nan-in-javascript
          var isNotNum = value !== value;

          if (!isNotNum) {
            scope.model = value;
            scope.$watch(function () {
              return scope.isEditing;
            }, onIsEditingChange);
            disconnect();
          }
        });

        ngModel.$viewChangeListeners.push(function () {
          scope.model = ngModel.$modelValue;
        });
      }

      function onIsEditingChange(value) {
        if (value) {
          $timeout(function () {
            return $input[0].focus();
          });
          prevValue = angular.copy(scope.model);
          $input.on('blur keypress', validate);
        } else {
          $input.off('blur keypress', validate);
        }

        if (scope.onStateChange && value !== undefined) {
          scope.onStateChange({ $isEditing: angular.copy(value) });
        }

        if (scope.onChange && value === false && prevValue !== undefined && prevValue !== scope.model) {
          scope.onChange({ $value: angular.copy(scope.model) });
        }
      }

      function validate(evt) {
        if (evt.type !== 'blur' && evt.keyCode !== KEYS.ENTER) {
          return;
        }

        var isEditing = false;
        var isModelEmpty = angular.isDefined(scope.model) ? scope.model.search(/\w+/g) < 0 : true;

        isEditing = isModelEmpty ? true : ngModel.$ivalid && ngModel.$dirty;

        scope.isEditing = isEditing;
        scope.$apply();
      }
    }
  });

  return m.name;
});

//# sourceMappingURL=editme.compiled.js.map