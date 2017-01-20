Feature: test

  Scenario: basic
    Given the following documents exist in the '${constants.TEST}' collection:
    """
    [
      {_id: constants.ONE, timestamp: new Date()},
      {_id: '2'}
    ]
    """
    Then mongo query "{_id: constants.ONE}" on '${constants.TEST}' should be like:
    """
      [{_id: constants.ONE, timestamp: 'assert(actual.constructor.name == "Date")'}]
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

    Scenario: aggregation
      Given the following documents exist in the '${constants.TEST}' collection:
      """
      [
        {_id: 'id-1'},
        {_id: 'id-2'},
        {_id: 'id-3'}
      ]
      """
      When the following aggregation steps execute on the '${constants.TEST}' collection:
      """
      [
        {$match: {_id: {$gt: 'id-1'}}},
        {$sort: {_id: -1}}
      ]
      """
      Then the result should be like:
      """
      [
        {_id: 'id-3'},
        {_id: 'id-2'}
      ]
      """

    Scenario: validator string
      Given the following validator exists on the '${constants.TEST}' collection:
      """
      {name: {$type: 'string'}}
      """

    Scenario: validator variable
      Given the following validator exists on the '${constants.TEST}' collection:
      """
      constants.validators.test
      """
