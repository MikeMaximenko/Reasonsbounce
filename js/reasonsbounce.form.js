(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.reasonsbounceForm = {
    attach: function (context, settings) {
      var eventHandler = drupalSettings.reasonsbounce.form.function;
      switch (eventHandler) {
        case "onbeforeunload":
          window.onbeforeunload = function(e) {
            e = e || window.event;
            var text = drupalSettings.reasonsbounce.form.message;
            if (e) {
              e.returnValue = text;
            }
            setTimeout(function() {
              var ajaxObject = Drupal.ajax({url: drupalSettings.reasonsbounce.form.path});
              ajaxObject.execute();
            }, 1000);
          }

          $("a, form, select, div").each(function(index, value){
            $(this).click(function(e) {
              window.onbeforeunload = function(e) {};
            });
          });
          break;

        case "onload":
          window.onload = function(e) {
            var ajaxObject = Drupal.ajax({url: drupalSettings.reasonsbounce.form.path + '?destination=' + drupalSettings.reasonsbounce.form.redirect});
            ajaxObject.execute();
          }

          $('<div id="contact-form-select">').insertAfter(".field--name-field-role select.form-select");

          var $select = $('.field--name-field-role select.form-select').smartselect({
            text: {
              selectLabel: "Select Role\'s..."
            },
            specialValueSeperator: '//',
            callback: {
              onOptionSelect: [
                // if inputbox has no value, disable select
                function($target, event) {
                  $('.dropdown-toggle.btn span.ss-label').removeClass('first-state');
                  if ($target.find(" input#other").length != 0) {
                    $('.ui-dialog-reasonsbounce .field--name-field-other input.form-text').val($target.find("input#other").val());
                    $('input#other').focus();
                  }

                }
              ],
              onOptionDeselect: [
                function($target, event) {
                  if ($target.find("input#other").length != 0) {
                    $('.ui-dialog-reasonsbounce .field--name-field-other input.form-text').val(null);
                  }
                }
              ],
            },
            toolbar: false
          }).getsmartselect();

          if($select) {
            $select.addOption({
              value: 'other',
              'data-special': true,
              html: '<div class="other-title">Other:</div><label class="ss-nobubble"><input type="text" title="Other:" id="other" class="form-control input-sm"></label>'
            });
          }
          break;
      }
      $("input#other").on("focusout", function(e) {
        var $jq = $(this);
        var val = $jq.val();
        if (val === "") {
          $select.deselectOptions(['other']);
          $(".ui-dialog-reasonsbounce .field--name-field-other input.form-text").val(null);
        }
      });
      $('input#other').on('input', function() {
        $select.selectOption(['other']);
        $(".ui-dialog-reasonsbounce .field--name-field-other input.form-text").val($('.active #other').val());
      });

      $('.like').click(function () {
        switchStage();
        $('.js-form-item-field-first-question-response-0-value input.form-text').val('Yes');
        $('.ui-dialog-reasonsbounce .the-question.answer-yes').removeClass('hide');
        $('.ui-dialog-reasonsbounce .field--name-field-yes-no-question').addClass('hide');
      });
      $('.dislike').click(function () {
        switchStage();
        $('.js-form-item-field-first-question-response-0-value input.form-text').val('No');
        $('.ui-dialog-reasonsbounce .the-question.answer-no').removeClass('hide');
        $('.ui-dialog-reasonsbounce .field--name-field-yes-no-question').addClass('hide');
      });
      function switchStage() {
        $('.ui-dialog-first-stage').addClass('ui-dialog-second-stage').removeClass('ui-dialog-first-stage');
        $('.ui-dialog-reasonsbounce .dropdown .ss-option.active').removeClass('active');
        $('.ui-dialog-reasonsbounce .dropdown-toggle.btn span.ss-label').addClass('first-state');
        $('.ui-dialog-reasonsbounce .dropdown .dropdown-toggle span.ss-label').text('Select Role\'s...');
        $(window).scrollTop(1);
      }
    }
  };
})($jq, Drupal, drupalSettings);