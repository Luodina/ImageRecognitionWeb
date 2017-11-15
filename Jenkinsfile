node {
    def app 
    env.DOCKER_REGISTRY = 'docker-registry-default.ai-dev.asiainfo.com'    
    properties([
        parameters {
            string(name: 'REGISTRY_CREDENTIAL', defaultValue: 'pUVw-eJJwvowCAIexHb4eQyVVHxYSLWJORYbvR3IPUU')
        }
    ])
    stage('Clone Repository...') {
        checkout scm 
        //sh 'printenv'
        // sh 'ls'
        // sh 'cd ./Basic && ls && npm -v && npm install && bower install && echo "gulp build..." && gulp build'
        // sh 'ls'
    }
    stage('Build Docker Image ...') {
        app = docker.build("luodina/${env.BRANCH_NAME.toLowerCase()}")
    }
    stage('Acceptance Tests...') {
        app.withRun{
            echo 'Tests passed'
            // sh 'node build-server/app.js'
        }
    }
    stage('Docker Image Push...') {
        docker.withRegistry('https://registry.hub.docker.com') {
            sh "docker login -u luodina -p luodina registry.hub.docker.com"  
            echo "tag docker image ${env.BUILD_NUMBER} ..."    
            app.push("${env.BUILD_NUMBER}")
        }
        // docker.withRegistry("https://${env.DOCKER_REGISTRY}"){
        //     sh "docker login -u aura -p ${params.REGISTRY_CREDENTIAL} ${env.DOCKER_REGISTRY}"
        //     app.push("${env.BRANCH_NAME.toLowerCase()}")
        // }
    }
}