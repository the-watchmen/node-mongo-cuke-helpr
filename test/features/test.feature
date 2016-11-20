Feature: test

  Scenario: basic
    Given the following documents exist in the '${constants.TEST}' collection:
    """
    [
      {_id: constants.ONE},
      {_id: '2'}
    ]
    """
    Then mongo query "{_id: constants.ONE}" on '${constants.TEST}' should be like:
    """
      [{_id: constants.ONE}]
    """

  Scenario: geo
    Given the following documents exist in the '${constants.TEST}' collection:
    """
    [
      {
        _id: constants.ONE,
        geoPoint: {
          type: 'Point',
          coordinates: [-73.958025, 40.77007] /* 10021 */
        }
      },
      {
        _id: '2',
        geoPoint: {
          type: 'Point',
          coordinates: [-72.62103, 41.778589] /* 06108 */
        }
      }
    ]
    """
    And the following indices exist on the '${constants.TEST}' collection:
    """
    [{geoPoint: '2dsphere'}]
    """
    Then mongo query "{geoPoint: {$near: {$geometry: {type: 'Point', coordinates: [-73.968285, 40.785091]}, $maxDistance: 5000}}}" on '${constants.TEST}' should be like:
    """
      [{_id: constants.ONE}]
    """
