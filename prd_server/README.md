# PRD-Forecasting-Server

# Create a virtual environment to isolate our package dependencies locally
python3 -m venv env
source env/bin/activate

# Install Django and Django REST framework into the virtual environment
pip install -r requirements.txt

# Set up a new project with a single application
django-admin startapp prd