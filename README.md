# FreeGPT

Experience the power of **G**enerative **P**retrained **T**ransformers with a user-friendly interface.

## GPT 3.5/4, LLaMA, Mixtral

<strong>NO API KEY REQUIERED</strong>

  
## UI

Desktop

<img src="https://github.com/Mylinde/freegpt/blob/main/client/img/desktop-ui.png" width="1000" />

<img src="https://github.com/Mylinde/freegpt/blob/main/client/img/desktop-ui-light.png" width="1000" />
  
Mobile Device PWA

<img src="https://github.com/Mylinde/freegpt/blob/main/client/img/mobile-ui.png" width="30%" />  <img src="https://github.com/Mylinde/freegpt/blob/main/client/img/mobile-ui-light.png" width="30%" />

Reader mode in PWA

<img src="https://github.com/Mylinde/freegpt/blob/main/client/img/reader.png" width="30%" />  <img src="https://github.com/Mylinde/freegpt/blob/main/client/img/reader-light.png" width="30%" />



## Features 📢
- Client runs also as PWA
- Reader mode by double tap in PWA
- Save conversation as pdf from reader mode
- Share conversation as text from reader mode
- Awesomefont replaced with material icons
- light/dark theme follows the system
- 3rd party sources stored local
- code clean up
- flask-compress
- orjson
- gunicorn
- redis for caching (local running redis-server required)

## Known bugs 🚧
- Mixtral interrupts long answers. By typing "continue" it continues.
https://github.com/xtekky/gpt4free/issues/1666

## Table of Contents  
- [Getting Started](#getting-started-white_check_mark)  
  - [Cloning the Repository](#cloning-the-repository-inbox_tray)  
  - [Install Dependencies](#install-dependencies-wrench)  
- [Running the Application](#running-the-application-rocket)
- [Incorporated Projects](#incorporated-projects-busts_in_silhouette)
  - [WebUI](#webui) 
  - [API FreeGPT](#api-g4f)
- [Legal Notice](#legal-notice) 

## Getting Started :white_check_mark:  
To get started with this project, you'll need to clone the repository and have [Python](https://www.python.org/downloads/) installed on your system. (Version 3.10+ is recommend)
  
### Cloning the Repository :inbox_tray:
Run the following command to clone the repository:
```
git clone https://github.com/Mylinde/freegpt.git
```

### Install Dependencies :wrench: 
Navigate to the project directory:
```
cd freegpt
```

Install the dependencies:
```
pip install -r requirements.txt
```
## Running the Application :rocket:
To run the application, run the following command:

I suggest to use the python -B flag to not generate the bytecode cache. It ensures that any changes made to the code will be reflected in the next run, without having to manually delete the bytecode cache. 

```
python -m gunicorn --config gunicorn_config.py run:app
```
or for running with werkzeug:
```
python run.py
```

Access the application in your browser using the URL:
```
http://127.0.0.1:1338
```
or
```
http://localhost:1338
```

## Docker 🐳
### Prerequisites
Before you start, make sure you have installed [Docker](https://www.docker.com/get-started) on your machine.

### Running the Docker
Dockerfile for creating a Docker image yourself  
Then we can create an image using the following commands:
```
git clone https://github.com/Mylinde/freegpt.git cd freegpt
```

Build image:
```
docker build -f Dockerfile -t freegpt .
```

Run the application using Docker:
```
docker run -p 1338:1338 freegpt:latest
```

Access the application in your browser using the URL:
```
http://127.0.0.1:1338
```
or
```
http://localhost:1338
```

When you're done using the application, stop the Docker containers using the following command:
```
docker stop <container-id>
```

## Incorporated Projects :busts_in_silhouette:

### WebUI
The application interface was incorporated from the [chatgpt-clone](https://github.com/xtekky/chatgpt-clone) repository.

### API G4F
The free GPT-4 API was incorporated from the [GPT4Free](https://github.com/xtekky/gpt4free) repository.

## Legal Notice
This repository is _not_ associated with or endorsed by providers of the APIs contained in this GitHub repository. This
project is intended **for educational purposes only**. This is just a little personal project. Sites may contact me to
improve their security or request the removal of their site from this repository.

Please note the following:

1. **Disclaimer**: The APIs, services, and trademarks mentioned in this repository belong to their respective owners.
   This project is _not_ claiming any right over them nor is it affiliated with or endorsed by any of the providers
   mentioned.

2. **Responsibility**: The author of this repository is _not_ responsible for any consequences, damages, or losses
   arising from the use or misuse of this repository or the content provided by the third-party APIs. Users are solely
   responsible for their actions and any repercussions that may follow. We strongly recommend the users to follow the
   TOS of the each Website.

3. **Educational Purposes Only**: This repository and its content are provided strictly for educational purposes. By
   using the information and code provided, users acknowledge that they are using the APIs and models at their own risk
   and agree to comply with any applicable laws and regulations.

4. **Copyright**: All content in this repository, including but not limited to code, images, and documentation, is the
   intellectual property of the repository author, unless otherwise stated. Unauthorized copying, distribution, or use
   of any content in this repository is strictly prohibited without the express written consent of the repository
   author.

5. **Indemnification**: Users agree to indemnify, defend, and hold harmless the author of this repository from and
   against any and all claims, liabilities, damages, losses, or expenses, including legal fees and costs, arising out of
   or in any way connected with their use or misuse of this repository, its content, or related third-party APIs.

6. **Updates and Changes**: The author reserves the right to modify, update, or remove any content, information, or
   features in this repository at any time without prior notice. Users are responsible for regularly reviewing the
   content and any changes made to this repository.

By using this repository or any code related to it, you agree to these terms. The author is not responsible for any
copies, forks, or reuploads made by other users. This is the author's only account and repository. To prevent
impersonation or irresponsible actions, you may comply with the GNU GPL license this Repository uses.
