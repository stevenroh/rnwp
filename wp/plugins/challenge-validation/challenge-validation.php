<?php
/*
 * Plugin Name:       RNWP Challenges
 * Plugin URI:        https://stevenroh.ch
 * Description:       Handle the challenge validation
 * Version:           1.0
 * Author:            Steven Roh
 * Author URI:        https://stevenroh.ch
 */

add_action('rest_api_init', function () {
  register_rest_route('rnwp/v1', '/challenge-validation/(?P<id>\d+)', array(
    'methods' => 'POST',
    'callback' => 'rnwp_validate_challenge',
  ));
});

function rnwp_validate_challenge(WP_REST_Request $request)
{
  // You can access parameters via direct array access on the object:
  $parameters = $request->get_json_params();
  $code = $parameters['code'];

  $challenge_id = $request->get_url_params()['id'];
  $challenge = get_post($challenge_id);

  if ($challenge->post_type !== 'challenge') {
    return new WP_REST_Response([
      'message' => 'Challenge not found'
    ], 404);
  }

  if (get_field('code', $challenge_id) !== $code) {
    return new WP_REST_Response([
      'message' => 'Validation error'
    ], 403);
  }

  return new WP_REST_Response([
    'message' => 'Validation ok'
  ]);
}
