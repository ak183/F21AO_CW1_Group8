pipeline {

    environment {
        registery ="asadkamal/pipelineauto"
        registerCredentials = 'dockerhub-cre'
        dockerImage = ''
    }
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                script {
             dockerImage = docker.build registery + ":$BUILD_NUMBER"
             imagename = dockerImage.imageName()
             sh "echo $imagename"
            
              }
            }
        }

        stage('Build Test') {
                steps {
                    sh "docker run -e CI=true $imagename npm run test"
                }
            }


        stage ('Deploying Docker Image to DockerHub') {

            steps {
                script {
                    docker.withRegistry('', registerCredentials) {
                        dockerImage.push()
                    }
                }
            }
        }

        }
}
