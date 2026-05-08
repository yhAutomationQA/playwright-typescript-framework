pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile'
            args '--ipc=host'
        }
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'qa', 'staging', 'prod'],
            description: 'Target test environment'
        )
        choice(
            name: 'TEST_TYPE',
            choices: ['regression', 'smoke'],
            description: 'Run full regression or smoke tests only'
        )
    }

    environment {
        ENV = "${params.ENVIRONMENT}"
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    def testCmd = params.TEST_TYPE == 'smoke'
                        ? 'npx playwright test --grep @smoke'
                        : 'npx playwright test'

                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh testCmd
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                sh 'npm run allure:generate || echo "Allure CLI not available — skipping"'
            }
        }

        stage('SonarQube Analysis') {
            when {
                environment name: 'SONAR_HOST_URL', value: ''
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'npm run sonar:scan'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'screenshots/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'logs/**', allowEmptyArchive: true
            cleanWs()
        }
        failure {
            echo 'Pipeline failed. Check archived artifacts for diagnostics.'
        }
        unstable {
            echo 'Tests completed with failures. Review archived reports.'
        }
    }
}
