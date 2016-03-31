'use-strict';

angular.module('app', [
  'shaka-editme'
])

.controller('DemoController', function() {
  let vm = this;

  vm.fullname     = 'Donatello';
  vm.location     = 'Greater New York City Area';
  vm.curposition  = 'Full-time Ninja';
  vm.prevpostion  = 'Pizza Delivery';
  vm.education    = 'Home Schooled';

  vm.email = 'ryan@email.com';
  vm.city = 'Toronto';
  vm.desc = `Donatello, often shortened to Don or Donny is one of the four protagonists of the Teenage Mutant Ninja Turtles comics and all related media. He is co-creator Peter Laird's favorite Turtle. In the Mirage/Image Comics, all four turtles wear red bandanas, but in other versions he wears a purple bandana. His primary signature weapon is his effective bō staff. In all media, he is depicted as the smartest and second-in-command of the four turtles. Donnie often speaks in technobabble with a natural aptitude for science and technology. He is named after the Italian sculptor Donatello.`;

  vm.h1 = 'Wrapped with <h1> tag';
  vm.h2 = 'Wrapped with <h2> tag';
  vm.p = 'Wrapped with <p> tag';

  vm.testing = (isEditing) => {
    console.log('edit state change', isEditing);
  }

  vm.errorCheck = ($error) => {
    console.log('error', $error);
  }
});