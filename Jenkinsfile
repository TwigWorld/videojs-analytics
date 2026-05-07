pipeline {
    agent {
        docker {
            image 'cypress/browsers:node-20.18.0-chrome-130.0.6723.69-1-ff-131.0.3-edge-130.0.2849.56-1'
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
