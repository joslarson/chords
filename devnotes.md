
## Components ##

- user (accounts created via Google, Facebook, or Twitter)

- chord_set
  * id
  * name
  * description
  * tuning
  * user
  * created
  * modified

- chord
  * id
  * chord_data:
    ```json
    {

    }
    ```
  * chord_set
  * created
  * modified

  O O X - - -

If we store chord data relationally, then we can suggest chords to go with other chords