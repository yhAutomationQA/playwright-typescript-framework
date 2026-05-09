pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'qa', 'staging', 'prod'],
            description: 'Target test environment',
        )
        choice(
            name: 'TEST_TYPE',
            choices: ['regression', 'smoke'],
            description: 'Run full regression or smoke tests only',
        )
    }

    environment {
        ENV = "${params.ENVIRONMENT}"
        CI = 'true'
        PATH = '/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t playwright-tests .'
            }
        }

        stage('Setup') {
            steps {
                sh 'docker run --rm -v "$PWD:/app" playwright-tests sh -c "npm ci"'
            }
        }

        stage('Lint') {
            steps {
                sh 'docker run --rm -v "$PWD:/app" -e CI playwright-tests sh -c "npm run lint"'
            }
        }

        stage('Snyk Security Scan') {
            when {
                expression { env.SNYK_TOKEN != null && env.SNYK_TOKEN != '' }
            }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'docker run --rm -v "$PWD:/app" -e SNYK_TOKEN playwright-tests sh -c "npm run snyk:test"'
                }
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    def testCmd = params.TEST_TYPE == 'smoke'
                        ? 'npx playwright test --grep @smoke'
                        : 'npx playwright test'

                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        sh "docker run --rm -v \"\$PWD:/app\" -e CI -e ENV --ipc=host playwright-tests sh -c \"${testCmd}\""
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                sh "docker run --rm -v \"\$PWD:/app\" playwright-tests sh -c 'npm run allure:generate || true'"
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { env.SONAR_TOKEN != null && env.SONAR_TOKEN != '' }
            }
            steps {
                sh 'docker run --rm -v "$PWD:/app" -e SONAR_TOKEN playwright-tests sh -c "npm run sonar:scan"'
            }
        }
    }

    post {
        always {
            sh 'mkdir -p screenshots logs'
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
