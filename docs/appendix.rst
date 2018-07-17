.. index:: ! appendix
.. _appendix:


#################
Contract Appendix
#################

Functions
~~~~~~~~~

================    ====================================================
ID                  ETf1
================    ====================================================
Name                ``hasSufficientBalance``

Description         | Requirement function for determining whether or not sender has sufficient balance
                    | for an escrow withdrawl.


Contract            ``EscrowToken.sol``

Emits               *None*

Parameters          | ``uint256`` **_amount** -- amount to be assessed for withdrawl


Requirements        - Sender must have a balance greater than or equal to the amount for withdrawl

Returns             ``bool`` success of sufficient balance
================    ====================================================



================    ====================================================
ID                  ETf2
================    ====================================================
Name                ``withdrawFrom``

Description         | Escrow function for withdrawing a balance amount from the targeted address, in
                    | order to be hold in escrow. This function is used when contributing to organzation,
                    | projects, and tasks.


Contract            ``EscrowToken.sol``

Emits               ``Withdrawn`` event

Parameters          | ``uint256`` **_amount** -- amount to be withdrawn
                    | ``address`` **_target** -- account from which amount is withdrawn


Requirements        *None*

Returns             *None*
================    ====================================================



================    ====================================================
ID                  ETf3
================    ====================================================
Name                ``depositTo``

Description         | Escrow function for depositing a balance amount to the targeted address, in order to
                    | release from escrow. This function is used when disbursing payments and recalling
                    | contributions to organzation, projects, and tasks.

Contract            ``EscrowToken.sol``

Emits               ``Deposited`` event

Parameters          | ``uint256`` **_amount** -- amount to be deposited
                    | ``address`` **_target** -- account to which amount is being deposited

Requirements        *None*

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Of1
================    ====================================================
Name                ``formOrganization``

Description         | Initialization function used to create organization tied to the sender's address.
                    | This is done by initializing the organizations detail hash. Once this function has been
                    | called it cannot be called again, so as to avoid organization destruction. This
                    | initializes the sender as the admin of the organization.

Contract            ``Organization.sol``

Emits               ``OrganizationFormed`` event

Parameters          | ``bytes32`` **_details** -- hash of organization details

Requirements        - Senders organzation detail hash must be uninitialized
                    - Provided details must not be non-zero, from **GSs9**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Of2
================    ====================================================
Name                ``modifyOrganization``

Description         | Sets the details of an organization with a new detail hash. This must be done by an
                    | organization admin.


Contract            ``Organization.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of organization targeted for modification
                    | ``bytes32`` **_details** -- new hash of organization details

Requirements        - Sender must be an admin, from **GSsA**
                    - Provided details must not be non-zero, from **GSs9**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Of3
================    ====================================================
Name                ``setAdminStatus``

Description         | Sets the admin status of a targeted address for the targeted organization. This can be
                    | used to enable or disable an admin by another organization admin.


Contract            ``Organization.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization in question
                    | ``address`` **_admin** -- address targeted for admin status change
                    | ``bool`` **_status** -- whether or not target is being validated or invalidated


Requirements        - Sender must be an admin, from **GSsA**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Of4
================    ====================================================
Name                ``createProject``

Description         | Initialization function used to create an organization project. This is done by
                    | initializing a **GSs5** with the projects detail hash into the project array of
                    | the organization.


Contract            ``Organization.sol``

Emits               ``ProjectCreated`` event

Parameters          | ``address`` **_org** -- address of the organization in question
                    | ``bytes32`` **_details** -- hash of project details


Requirements        - Sender must be an admin, from **GSsA**
                    - Provided details must not be non-zero, from **GSs9**

Returns             ``uint256`` ID of project within the organization's project array
================    ====================================================



================    ====================================================
ID                  Of5
================    ====================================================
Name                ``distributeToProject``

Description         | Distributes value contributed to an organization to a specific project of the
                    | organization, as deemed fit by an admin of the organization. This decreases the total
                    | value associated with the organization and increases the total value distributed and
                    | associated with the project.


Contract            ``Organization.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project targeted for distribution
                    | ``uint256`` **_amount** -- amount being distributed


Requirements        - Sender must be an admin, from **GSsA**
                    - | Amount being distributed to project must not exceed total amount contributed to
                      | the organization

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Of6
================    ====================================================
Name                ``recallProjectDistribution``

Description         | Recalls distributed value contributed to an project back to the organization. This can
                    | be used to return value back to contributors or redistribute to other organization
                    | projects. This increases the total value associated with the organization and decreases
                    | the total value distributed and associated with the project.


Contract            ``Organization.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project targeted for distribution recall
                    | ``uint256`` **_amount** -- amount being recalled


Requirements        - Sender must be an admin, from **GSsA**
                    - Recall amount must not exceed total amount distributed to project.
                    - Recall amount must not exceed total value associated with project.

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf1
================    ====================================================
Name                ``modifyProject``

Description         | Sets the details of a project with a new detail hash. This must be done by an
                    | organization admin.


Contract            ``Project.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project targeted for modification
                    | ``bytes32`` **_details** -- new hash of organization details

Requirements        - Sender must be an admin, from **GSsA**
                    - Provided details must not be non-zero, from **GSs9**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf2
================    ====================================================
Name                ``createTask``

Description         | Initialization function used to create an project tasks. This is done by
                    | initializing a **GSs6** with the task detail hash into the task array of
                    | the project.


Contract            ``Project.sol``

Emits               ``TaskCreated`` event

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project targeted to which the task is assigned
                    | ``bytes32`` **_details** -- hash of task details


Requirements        - Sender must be an admin, from **GSsA**

Returns             ``uint256`` ID of task within the project's task array
================    ====================================================



================    ====================================================
ID                  Pf3
================    ====================================================
Name                ``modifyTask``

Description         | Sets the details of a tasks with a new detail hash. This must be done by an
                    | organization admin.


Contract            ``Project.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task targeted for modification
                    | ``bytes32`` **_details** -- new hash of task details

Requirements        - Sender must be an admin, from **GSsA**
                    - Provided details must not be non-zero, from **GSs9**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf4
================    ====================================================
Name                ``distributeToTask``

Description         | Distributes value contributed to a project to a specific task of the
                    | project, as deemed fit by an admin of the organization. This decreases the total
                    | value associated with the project and increases the total value distributed and
                    | associated with the task.


Contract            ``Project.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task targeted for distribution
                    | ``uint256`` **_amount** -- amount being distributed


Requirements        - Sender must be an admin, from **GSsA**
                    - | Amount being distributed to task must not exceed total amount contributed to
                      | the project

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf5
================    ====================================================
Name                ``recallTaskDistribution``

Description         | Recalls distributed value contributed to a task back to the project. This can
                    | be used to return value back to contributors or redistribute to other project tasks.
                    | This increases the total value associated with the project and decreases
                    | the total value distributed and associated with the task.


Contract            ``Project.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task targeted for recall
                    | ``uint256`` **_amount** -- amount being recalled


Requirements        - Sender must be an admin, from **GSsA**
                    - Recall amount must not exceed total amount distributed to task.
                    - Recall amount must not exceed total value associated with task.

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf6
================    ====================================================
Name                ``disbursePayment``

Description         | Disburses payment to a specific submission of a task. This initailizes a **GSs8**
                    | with the amount being disbursed and the release time from when the function is
                    | called with the addition of the buffer provided by **GSs1**. This delay is to avoid
                    | any malicious payment situation and allow for recalling and / or readministration.


Contract            ``Project.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task of the submission
                    | ``uint256`` **_submission** -- ID of the submission targeted for disbursement
                    | ``uint256`` **_amount** -- amount being disbursed


Requirements        - Sender must be an admin, from **GSsA**
                    - Amount being disbursed must not exceed value of task itself

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf7
================    ====================================================
Name                ``recallPayment``

Description         | Recalls payment to a specific submission of a task. This is used to undo a
                    | disbursement to a submission. If the payment has already been retrieved by the
                    | submitter this will have  no effect. However, if it has not been retrieved , this will
                    | set the payment value of the disbursement to zero.


Contract            ``Project.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task of the submission
                    | ``uint256`` **_submission** -- ID of the submission targeted for payment recall
                    | ``uint256`` **_amount** -- amount being recalled


Requirements        - Sender must be an admin, from **GSsA**
                    - Amount being recalled must not already be retrieved

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Sf1
================    ====================================================
Name                ``createSubmission``

Description         | Initialization function used to create an task submission. This is done by
                    | initializing a **GSs7** with the submission detail hash into the submission array of
                    | the task.


Contract            ``Submission.sol``

Emits               ``SubmissionCreated`` event

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task of the submission
                    | ``bytes32`` **_details** -- hash of submission details


Requirements        *None*

Returns             ``uint256`` ID of submission within the task's submission array
================    ====================================================



================    ====================================================
ID                  Sf2
================    ====================================================
Name                ``modifySubmission``

Description         | Sets the details of a submission with a new detail hash. This must be done by an
                    | organization admin.


Contract            ``Submission.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task of the submission
                    | ``uint256`` **_submission** -- ID of the submission targeted for modification
                    | ``bytes32`` **_details** -- new hash of submission details


Requirements        - Sender must be submitter of the submission

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Sf3
================    ====================================================
Name                ``retrievePayment``

Description         | Collects payment disbursed to sender through **Pf6**. This deposits the
                    | disbursement amount to the balance of the sender and zeros the value of the
                    | payment.


Contract            ``Submission.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- address of the organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task of the submission


Requirements        - The payment lockout time must have expired

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf1
================    ====================================================
Name                ``voteOnEnableAdmin``

Description         | Votes on a specific admin as to whether or not this admin should be enabled. If the
                    | sender is voting yes, the total stake of the sender within the organization will
                    | increment the total enabling votes for that admin. If the sender is voting no, the
                    | total enabling votes will decrement by the amount of the sender's previous votes.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``address`` **_org** --  address of the organization in question
                    | ``address`` **_target** -- address of the target for admin status
                    | ``bool`` **enable** -- the sender's approval or disapproval sign

Requirements        *None*

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Mf2
================    ====================================================
Name                ``voteOnDisableAdmin``

Description         | Votes on a specific admin as to whether or not this admin should be disabled. If the
                    | sender is voting yes, the total stake of the sender within the organization will
                    | increment the total disabling votes for that admin. If the sender is voting no, the
                    | total disabling votes will decrement by the amount of the sender's previous votes.


Contract            ``Moderation.sol``

Emits               *None*

Parameters          | ``address`` **_org** --  address of the organization in question
                    | ``address`` **_target** -- address of the target for admin status
                    | ``bool`` **enable** -- the sender's approval or disapproval sign


Requirements        *None*

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf1
================    ====================================================
Name                ``contributeToOrganization``

Description         | Contributes value to an organization by withdrawing from the sender and holding it in
                    | escrow for eventual release to submitter's of tasks. This contribution increments the
                    | sender's stake of the organization and increments the total value associated with the
                    | organization.


Contract            ``Contribution.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- organization targeted for contribution
                    | ``uint256`` **_amount** -- amount being contributed


Requirements        - Sender must have sufficient balance, from **ETf1**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf2
================    ====================================================
Name                ``contributeToProject``

Description         | Contributes value to a project by withdrawing from the sender and holding it in
                    | escrow for eventual release to submitter's of tasks. This contribution increments the
                    | sender's stake of the organization and increments the total value associated with the
                    | project.


Contract            ``Contribution.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- organization of the project
                    | ``uint256`` **_project** -- ID of the project targeted for contribution
                    | ``uint256`` **_amount** -- amount being contributed


Requirements        - Sender must have sufficient balance, from **ETf1**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf3
================    ====================================================
Name                ``contributeToTask``

Description         | Contributes value to a task by withdrawing from the sender and holding it in
                    | escrow for eventual release to submitter's of tasks. This contribution increments the
                    | sender's stake of the organization and increments the total value associated with the
                    | task.


Contract            ``Contribution.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task targeted for contribution
                    | ``uint256`` **_amount** -- amount being contributed


Requirements        - Sender must have sufficient balance, from **ETf1**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf4
================    ====================================================
Name                ``recallOrganizationContribution``

Description         | Recalls contributed value from an organization by withdrawing from the organization
                    | and depositing it back to the sender. This recall decrements the sender's stake of
                    | the organization and decrements the total value associated with the organization.


Contract            ``Contribution.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- organization targeted for recall
                    | ``uint256`` **_amount** -- amount being recalled


Requirements        - Recall amount must not exceed contribution made by sender
                    - Recall amount must not exceed total value associated with organization

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf5
================    ====================================================
Name                ``recallProjectContribution``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``Contribution.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- organization of the project
                    | ``uint256`` **_project** -- ID of the project targeted for recall
                    | ``uint256`` **_amount** -- amount being recalled


Requirements        - Recall amount must not exceed contribution made by sender
                    - Recall amount must not exceed total value associated with project

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Cf6
================    ====================================================
Name                ``recallTaskContribution``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``Contribution.sol``

Emits               *None*

Parameters          | ``address`` **_org** -- organization of the project
                    | ``uint256`` **_project** -- ID of the project of the task
                    | ``uint256`` **_task** -- ID of the task targeted for recall
                    | ``uint256`` **_amount** -- amount being recalled


Requirements        - Recall amount must not exceed contribution made by sender
                    - Recall amount must not exceed total value associated with task

Returns             *None*
================    ====================================================


Structures
~~~~~~~~~~

================    ====================================================
ID                  GSs1
================    ====================================================
Name                ``paymentLockout``

Contract            ``GenericStorage.sol``

Description         | Time value in seconds from when payment is dibursed by an admin to when it can be
                    | retrieved by the submitter.

Type                ``uint256``
================    ====================================================



================    ====================================================
ID                  GSs2
================    ====================================================
Name                ``orgs``

Contract            ``GenericStorage.sol``

Description         | Mapping of orgs as idenitified by the address of the creator, organizing all information
                    | pertraining to an organization.

Type                mapping of ``address`` to **GSs3**
================    ====================================================



================    ====================================================
ID                  GSs3
================    ====================================================
Name                ``Organization``

Contract            ``GenericStorage.sol``

Description         | Struct containing all pertinent information for a formed organization. This includes the
                    | detail hash of the organization, the total amount contribtued to the organization, a
                    | mapping of admin addresses, a mapping of individual stakes to the organization, a
                    | mapping of contributors to the organization, and an array of all projects created by
                    | the organization.

Type                ``struct``
================    ====================================================



================    ====================================================
ID                  GSs4
================    ====================================================
Name                ``Admin``

Contract            ``GenericStorage.sol``

Description         | Struct containing all pertinent information for an admin. This includes the current
                    | validity status of the admin, the vote accounting for enabling and disabling the admin,
                    | and the inidivudal vote accounts on this admin.

Type                ``struct``
================    ====================================================



================    ====================================================
ID                  GSs5
================    ====================================================
Name                ``Project``

Contract            ``GenericStorage.sol``

Description         | Struct containing all pertinent information for a project. This includes the detail
                    | hash, the total amount contributed to the project, the amount distributed to this
                    | project from the organization contributions, a mapping of the individual contributions
                    | made to the project, and an array of all tasks created for the project.

Type                ``struct``
================    ====================================================



================    ====================================================
ID                  GSs6
================    ====================================================
Name                ``Task``

Contract            ``GenericStorage.sol``

Description         | Struct containing all pertinent information for a task. This includes the detail
                    | hash, the total amount contributed to the task, the amount distributed to this
                    | task from the project contributions, a mapping of the individual contributions
                    | made to the task, and an array of all submissions created for the task.

Type                ``struct``
================    ====================================================



================    ====================================================
ID                  GSs7
================    ====================================================
Name                ``Submission``

Contract            ``GenericStorage.sol``

Description         | Struct containing all pertinent information for a submission. This includes the detail
                    | hash and the address of the creator.

Type                ``struct``
================    ====================================================



================    ====================================================
ID                  GSs8
================    ====================================================
Name                ``Payment``

Contract            ``GenericStorage.sol``

Description         | Struct containing all pertinent information for a payment. This includes the amount
                    | being paid and the time when this payment can be retrieved.

Type                ``struct``
================    ====================================================



================    ====================================================
ID                  GSs9
================    ====================================================
Name                ``validDetail``

Contract            ``GenericStorage.sol``

Description         | Modifier function for requiring that the modifications to any content does not
                    | uninitialize that content, by setting the detials to 0. This function is used by all
                    | content creation and modification functions.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  GSsA
================    ====================================================
Name                ``isAdmin``

Contract            ``GenericStorage.sol``

Description         | Modifier function for requiring that the sender of a function is a currently valid
                    | admin. This function is used all administrative functions.

Type                ``modifier``
================    ====================================================
