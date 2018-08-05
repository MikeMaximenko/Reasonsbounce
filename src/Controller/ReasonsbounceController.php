<?php

namespace Drupal\reasonsbounce\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;

class ReasonsbounceController extends ControllerBase {
  
  public function form($form_id) {
    $message = \Drupal::entityManager()
      ->getStorage('contact_message')
      ->create(array(
        'contact_form' => $form_id,
      ));
    $form = \Drupal::service('entity.form_builder')->getForm($message);

    $options = [
      'width' => '520px',
      'resizable' => false,
      'classes' => [
        'ui-dialog' => 'ui-dialog-reasonsbounce ui-dialog-first-stage'
      ],
      'position' => [
        'my' => 'right bottom',
        'at' => 'right-30 bottom',
      ],
    ];
    $contact_form_storage = \Drupal::entityManager()->getStorage('contact_form');
    $contact_form = $contact_form_storage->loadMultiple(array($form_id));

    $response = new AjaxResponse();
    $response->addCommand(new OpenModalDialogCommand(t($contact_form[$form_id]->label()), $form, $options));
    return $response;
  }
  
}
