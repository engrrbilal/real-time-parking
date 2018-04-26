import * as firebase from 'firebase'
import history from '../history';

// CREATE-USER
export const signUp = (user) => ({
    type: 'CREATE-USER',
    user
  });

export const startSignUp = (userData = {}) =>{
    console.log("creating account ...");
    return dispatch =>{
        const {
            fullName='',
            email='',
            password='',
            value='',
            createdAt=0
          } = userData;
          const type = {value}
          const user = {fullName,email,value,createdAt}
          console.log(user)
        firebase.auth().createUserWithEmailAndPassword(userData.email,userData.password)
         .then( data =>{
           let uid = data.uid
           console.log(uid)
           firebase.auth().currentUser.updateProfile({displayName:fullName})
           console.log(type.value)
               firebase.database().ref(`Users/${uid}`).set(user)
               dispatch(signUp({
                   uid:uid,
                   ...user
                }))
                setTimeout(() => {
                    history.push('/user')
                }, 1000)
        }).catch(console.log("error"))
    }   
  }
  
  export const signIn = (user) => ({
    type: 'USER-SIGNIN',
    user
  })

  export const startSignIn = (user = {}) =>{
    return dispatch => {
        console.log('user in signin', user)
        
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((signedinUser) => {
            let userid = signedinUser.uid
            console.log(userid)
            firebase.database().ref(`Users/${userid}`).once('value')
                .then((userData) => {
                    console.log(userData)
                    if(userData.val()){
                        const val = userData.val().value
                         console.log(val)
                        if(val=== "Admin"){
                            dispatch(signIn({
                                uid:userid,
                                ...user
                            }))
                                history.push("/admin")
                        }
                    else if(val=== "User"){
                        dispatch(signIn({
                            uid:userid,
                            ...user
                        }))
                            history.push("/user")
                    }
                    }
                    else{
                        signedinUser.delete()
                        alert("User not found")
                    }  
                  
                }
        )}
    )}
    }  