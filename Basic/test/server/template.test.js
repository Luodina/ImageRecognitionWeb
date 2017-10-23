/**
 * Created by gang.wu on 23/10/2017.
 */
'use strict';

import {describe, it} from 'mocha';
import {expect} from 'chai';
import {getTemplateNotebook, getAppFolderTemplate} from '../../server/template';

describe("template.test.js", function() {
  describe('getTemplateNotebook', function () {
    it('normal call', function () {
      let path = getTemplateNotebook(1);
      console.log(path);
      expect(path).not.to.be.empty;
    });
  });

  describe('getAppFolderTemplate', function () {
    it('normal call', function () {
      expect(getAppFolderTemplate()).not.to.be.empty;

    });
  });
})
