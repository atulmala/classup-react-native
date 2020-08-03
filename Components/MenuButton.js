import React from 'react'
import { View, StyleSheet, TouchableOpacity} from 'react-native'

const MenuButton = props => {
    return (<TouchableOpacity style={{...styles.button, ...props.style}}>{props.children}</TouchableOpacity>)
}

const styles = StyleSheet.create({

    button: {
        
        width: '45%',
        margin: 5,
        padding: 20,
        borderRadius: 15
    }
})

export default MenuButton