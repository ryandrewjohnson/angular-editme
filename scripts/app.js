angular.module('app', [
  'shaka-editme'
])

.controller('DemoController', function() {
  let vm = this;

  vm.fname = 'Ryan';
  vm.lname = 'Johnson';

  vm.email = 'ryan@email.com';
  vm.city = 'Toronto';
  vm.desc = 'Here is a longer descritption to put into a textarea to test what this looks like when there is longer text';

  vm.testing = (isEditing) => {
    console.log('edit state change', isEditing);
  }

  vm.errorCheck = ($error) => {
    console.log('error', $error);
  }
});