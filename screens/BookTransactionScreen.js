import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,TextInput,Image } from 'react-native';
import * as Permissions from 'expo-permissions'
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase'
import db from '../config'

export default class TransactionScreen extends React.Component{
    constructor(){
        super()
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedBookId:'',
            scannedStudentId:'',
            buttonState:'normal',
            transactionMessage:''

        }
    }
    getCameraPermissions=async(id)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==="granted",
            buttonState:id,
            scanned:false
        })
    }
    handleBarCodeScanned =async ({ type, data }) => {
        this.setState({
            scanned:true,
            buttonState:'normal',
            scannedData:data,

        })
    }
    handleTransaction=()=>{
        var transactionMessage
        db.collection('books').doc(this.state.scannedBookId).get()
        .then((doc)=>{
            var book=doc.data()
            if (book.bookAvailability) {
                this.initiateBookIssue()
                transactionMessage='Book Issued'
            } else {
                this.initiateBookReturn()
                transactionMessage='Book returned'}
        })
        this.setState({
            transactionMessage:transactionMessage
        })
    }
    render(){
        const hasCameraPermissions=this.state.hasCameraPermissions
        const scanned=this.state.scanned
        const buttonState=this.state.buttonState
        if (buttonState!=="normal"&& hasCameraPermissions) {
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
            )
        } else if (buttonState==="normal") {
            return(
                <View style= {styles.container}>
                    <View>
                        <Image source={require("../assets/bookLogo.jpg")} style={{width:200,height:200}}/>
                        <Text style={{textAlign:"center",fontSize:30}}>
                            Wily
                        </Text>
                    </View>
                   <View style= {styles.inputView}>
                    <TextInput style={styles.inputBox} placeholder="book Id"
                    value={this.state.scannedBookId}/>
                    <TouchableOpacity style={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermissions("BookId")
                    }
                    }>
                        <Text style= {styles.buttonText}>
                            Scan
                        </Text>
                    </TouchableOpacity>
                    </View> 
                    <View style= {styles.inputView}>
                    <TextInput style={styles.inputBox} placeholder="Student Id"
                    value={this.state.scannedStudentId}/>
                    <TouchableOpacity style={styles.scanButton}
                    onPress={()=>{
                        this.getCameraPermissions("StudentId")
                    }
                    }>
                        <Text style= {styles.buttonText}>
                            Scan
                        </Text>
                    </TouchableOpacity>
                    </View> 
                    <TouchableOpacity style={styles.submitButton}
                    onPress={async()=>{this.handleTransaction()}}>
                        <Text style={styles.submitButtonText}>
                            SUBMIT
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    displayText:{
        fontSize:15,
        textDecorationLine:'underline'
    },
    scanButton:{
        margin:10,
        padding:10,
        backgroundColor:'lightblue',
        
    },
    buttonText:{
        fontSize:20,
        textAlign:'center',
        marginTop:10
    },
    inputView:{
        flexDirection:'row',
        margin:20
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    }, 
    scanButton:{
        backgroundColor:'lightblue',
        width:50,
        borderWidth:1.5,
        borderLeftWidth:0
    },
    submitButton:{
        backgroundColor:'skyblue',
        width:100,
        height:50,
    },
    submitButtonText:{
        padding:10,
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold',
        color:'black'
    }
})