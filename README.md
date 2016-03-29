# angular-editme

Allows your AngularJS `<input>` and `<textarea>` elements to be edited inline ala [LinkedIn profiles](https://www.linkedin.com/).

## Installation

* install npm
* install bower
* install jspm

## Usage

Add the `shaka-editme` as a dependency to your Angular app's main module:

```javascript
angular.module('app', ['shaka-editme']);
```

#### Basic example:

```html
<form name="demo">
  ...
  <sk-editme>
    <input type="text" name="location" ng-model="locale" ng-required="true">
  </sk-editme>
  
  <sk-editme>
    <input type="text" name="description" ng-model="body" ng-required="true">
  </sk-editme>
</form>
```
