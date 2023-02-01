import React, { useState } from 'react'
import CreateTicketPage from './create-ticket-page'
const CreateTicketPageAdmin = () =>{
    return (
        <CreateTicketPage isAdmin={true} title={"Create Ticket Admin"}/>
    )
}
export default CreateTicketPageAdmin