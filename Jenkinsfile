pipeline {
    agent {
        docker {
            image 'cypress/browsers:node-24.15.0-chrome-147.0.7727.137-1-ff-150.0.1-edge-147.0.3912.86-1'
            label 'docker'
            args '-u root'
        }
    }

    environment {
        NODE_AUTH_TOKEN = credentials('NPM_TOKEN')
        HOME = '.'
    }

    stages {
        stage('Install') {
            steps {
                sh 'yarn install --frozen-lockfile --network-timeout 600000'
            }
        }

        stage('Verify') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'yarn lint'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'yarn test'
                    }
                }
                stage('Build') {
                    steps {
                        sh 'yarn build'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def jiraBranch = env.CHANGE_BRANCH ?: env.BRANCH_NAME
                jiraSendBuildInfo branch: jiraBranch, site: env.JIRA_SITE
                cleanWs()
            }
        }
    }
}
