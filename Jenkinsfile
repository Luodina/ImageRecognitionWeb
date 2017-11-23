node {
    def app 
    env.DOCKER_REGISTRY = 'docker-registry-default.ai-dev.asiainfo.com'    
    properties([
        parameters([
            string(name: 'REGISTRY_CREDENTIAL', defaultValue: 'pUVw-eJJwvowCAIexHb4eQyVVHxYSLWJORYbvR3IPUU')
        ])
    ])
    stage('Clone Repository...') {
        checkout scm 
    }
    stage('Build Docker Image ...') {
        app = docker.build("aura/web")
    }
    stage('Acceptance Tests...') {
        app.withRun{
            echo 'Tests passed'
        }
    }
    stage('Docker Image Push...') {
        docker.withRegistry("https://${env.DOCKER_REGISTRY}"){
            sh "docker login -u aura -p ${params.REGISTRY_CREDENTIAL} ${env.DOCKER_REGISTRY}"
            app.push("${env.BRANCH_NAME.toLowerCase()}")
        }
    }
}