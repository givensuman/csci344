# Set Up
1. Create a virtual environment:

    ```bash
    python3 -m venv env
    ```

2. Activate your virtual environment:

    ```bash
    source env/bin/activate
    ```

3. Install the python requirements (from te virtual environment):

    ```bash
    python -m pip install -r requirements.txt
    ```
    ```

4. Run the flask server:

    ```bash
    flask run --debug
    ```

5. Run the tests as follows (and make sure that your local Flask server is running):

    ```bash
    cd tests                                            # switch to your tests directory
    python run_tests.py                                 # run all tests
    python run_tests.py -v                              # run all tests verbose
    python run_tests.py TestCommentListEndpoint -v      # run some tests verbose

    # run a single test
    python run_tests.py TestCommentListEndpoint.test_comment_post_valid_request_201 -v       
    ```

6. Advanced: if you want to run the linter / isort options:

    * Install the dependencies from within the virtual environment.
        
        ```
        pip install isort
        pip install black
        pip install flake8
        ```

    * Run isort, ignoring the virtual environment using the skip flag:

        ```
        isort . -s env
        ```
    
    * Run black, ignoring the virtual environment using the skip flag:

        ```
        black . --exclude env
        ```

