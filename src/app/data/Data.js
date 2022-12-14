import axios from 'axios';

//const baseUri = 'https://ueapi.haeahn.com/api/BIMPerform';
const baseUri = 'http://localhost:5172/api/Transaction'

const GetAuthorityCode = (employeeId) => {
    try{
        return axios.get(baseUri + '/getAuthorityCode', {
            params: {employeeId:employeeId}
        });
    }
    catch(error){
        console.error(error);
    }   
}

const GetEmployeeProjects = (employeeId, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/getEmployeeProjects', {
            params: {employeeId:employeeId, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }   
}

const GetTeamProjects = (employeeId) => {
    try{ 
        return axios.get(baseUri + '/GetTeamProjects', {
            params: {employeeId:employeeId}
        });
    }
    catch(error){
        console.error(error);
    }   
}

const GetDepartmentProjects = (departmentCode) => {
    try{ 
        return axios.get(baseUri + '/GetDepartmentProjects', {
            params: {departmentCode:departmentCode}
        });
    }
    catch(error){
        console.error(error);
    }   
}

const GetTeamMembers = (projectCode) => {
    try{ 
        return axios.get(baseUri + '/GetTeamMembers', {
            params: {projectCode:projectCode}
        });
    }
    catch(error){
        console.error(error);
    }   
}

const GetDepartmentMembers = (departmentCode) => {
    try{ 
        return axios.get(baseUri + '/GetDepartmentMembers', {
            params: {departmentCode:departmentCode}
        });
    }
    catch(error){
        console.error(error);
    }   
}

const GetElements = (employeeId, projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/elements', {
            params: {employeeId:employeeId, projectCode:projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }   
}

const GetModelByCount = (employeeId, projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/getModelCountByName', {
            params: {employeeId:employeeId, projectCode:projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }  
}

const GetModelLogByTeam = (projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/GetModelLogByTeam', {
            params: {projectCode:projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }  
}

const GetAnnotationLogByTeam = (projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/GetAnnotationLogByTeam', {
            params: {projectCode:projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }  
}

const GetAnnotationByCount = (employeeId, projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/getAnnotationCountByName', {
            params: {employeeId:employeeId, projectCode:projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }  
}

const GetViewCountByType = (employeeId, projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/viewCountByType', {
            params: {employeeId:employeeId, projectCode:projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }  
}

const GetTransactionStatsByDate = (employeeId, projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/transactionStatsByDate', { 
        params: {employeeId: employeeId, projectCode: projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }
}

const GetTotalTransactionCount = (employeeId, projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/totalTransactionCount', { 
            params: {employeeId: employeeId, projectCode: projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }
}

const GetTotalModelCountByTeam = (projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/totalModelCountByTeam', { 
            params: {projectCode: projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }
}

const GetTotalAnnotationCountByTeam = (projectCode, startDate, endDate) => {
    try{
        return axios.get(baseUri + '/totalAnnotationCountByTeam', { 
            params: {projectCode: projectCode, startDate:startDate, endDate:endDate}
        });
    }
    catch(error){
        console.error(error);
    }
}



// const GetParticipantsCountByDate = (projectCode, startDate, endDate) => { 
//     try{
//         return axios.get(baseUri + '/participantCountByDate', { 
//         params: {employeeId: null, projectCode: projectCode, startDate:startDate, endDate:endDate}
//         });
//     }
//     catch(error){
//         console.error(error);
//     }
// }

const LoginUser = (userId, pw, authKey) => {
    try{
      return axios.post('https://api.haeahn.com/api/loginsso', new URLSearchParams({userId, pw, authKey}), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }
    catch(error){
      console.error(error);
    }
  }

export default {GetEmployeeProjects, GetTeamProjects, GetDepartmentProjects, GetTeamMembers, GetDepartmentMembers, GetModelByCount, GetModelLogByTeam, GetAnnotationLogByTeam, GetAnnotationByCount, GetViewCountByType, GetTransactionStatsByDate, GetTotalTransactionCount, GetTotalModelCountByTeam, GetTotalAnnotationCountByTeam, GetAuthorityCode, LoginUser}