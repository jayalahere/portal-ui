/**
 * This file was generated by:
 *   relay-compiler
 *
 * @providesModule RemoveFromExploreCaseSetButtonMutation.graphql
 * @generated SignedSource<<2d7c14f9602579ebfe78953c94dc474c>>
 * @relayHash 28f0f3b56f8bf0a631b2d8e81a8c3844
 * @flow
 * @nogrep
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type RelayIsDumb = {
  relay_is_dumb?: ?any;
};

export type RemoveFromExploreCaseSetButtonMutationResponse = {
  remove_from?: ?RemoveFromExploreCaseSetButtonMutationResponse_remove_from;
};

export type RemoveFromExploreCaseSetButtonMutationResponse_remove_from_explore_case = {
  set_id?: ?string;
};

export type RemoveFromExploreCaseSetButtonMutationResponse_remove_from_explore = {
  case?: ?RemoveFromExploreCaseSetButtonMutationResponse_remove_from_explore_case;
};

export type RemoveFromExploreCaseSetButtonMutationResponse_remove_from = {
  explore?: ?RemoveFromExploreCaseSetButtonMutationResponse_remove_from_explore;
};
*/


/*
mutation RemoveFromExploreCaseSetButtonMutation(
  $input: RemoveFromSetInput
  $never_used: RelayIsDumb
) {
  sets(input: $never_used) {
    remove_from {
      explore {
        case(input: $input) {
          set_id
        }
      }
    }
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "RemoveFromSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveFromExploreCaseSetButtonMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveFromSet",
            "name": "remove_from",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveFromExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveFromSetInput"
                      }
                    ],
                    "concreteType": "RemoveFromCaseSet",
                    "name": "case",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "RemoveFromExploreCaseSetButtonMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "RemoveFromSetInput",
        "defaultValue": null
      },
      {
        "kind": "LocalArgument",
        "name": "never_used",
        "type": "RelayIsDumb",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "RemoveFromExploreCaseSetButtonMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "never_used",
            "type": "RelayIsDumb"
          }
        ],
        "concreteType": "Sets",
        "name": "sets",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "RemoveFromSet",
            "name": "remove_from",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "RemoveFromExploreSet",
                "name": "explore",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "input",
                        "variableName": "input",
                        "type": "RemoveFromSetInput"
                      }
                    ],
                    "concreteType": "RemoveFromCaseSet",
                    "name": "case",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "set_id",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation RemoveFromExploreCaseSetButtonMutation(\n  $input: RemoveFromSetInput\n  $never_used: RelayIsDumb\n) {\n  sets(input: $never_used) {\n    remove_from {\n      explore {\n        case(input: $input) {\n          set_id\n        }\n      }\n    }\n  }\n}\n"
};

module.exports = batch;