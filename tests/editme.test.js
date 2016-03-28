describe('shaka-editme module', () => {
  let $injector,
      $rootScope,
      $compile,
      element,
      editmeEl,
      scope;

  beforeEach(() => {
    module('shaka-editme');

    inject(function(_$injector_) {
      $injector = _$injector_;
    });

    $rootScope  = $injector.get('$rootScope');
    $compile    = $injector.get('$compile');
    scope       = $rootScope.$new();
    element     = `
      <form name="tester">
        <sk-editme model="fname">
          <input type="text" class="form-control has-error" name="fname" ng-model="fname" ng-required="true">
        </sk-editme>
      </form>
    `;

    scope.fname = 'Fred';
    element = $compile(element)(scope);
    scope.$digest();
  });

  describe('with default minimum settings' , () => {
    beforeEach(() => {
      editmeEl = element.find('sk-editme');
    });

    it('should set model', () => {
      let iso = editmeEl.isolateScope();
      expect(iso.model).toBeDefined();
      expect(iso.model).toBe('Fred');
    });

    it('should have equal values for ng-model of input and scope.model', () => {
      let iso = editmeEl.isolateScope();
      let inputModel = editmeEl.find('input').val();
      expect(iso.model).toEqual(inputModel);
    });

    it('should hide content by default', () => {
      let content = editmeEl.find('content');
      expect(content.is(':hidden')).toBe(true);
    });

    it('should show model-wrapper by default', () => {
      let wrapper = editmeEl.find('.model-wrapper');
      expect(wrapper.hasClass('ng-hide')).toBe(false);
    });

    it('should include edit icon by default', () => {
      let icon = editmeEl.find('sk-editme-icon');
      expect(icon.length).toBe(1);
    });

  });
});