import React, { useState } from 'react'
import CreateTicketPage from './create-ticket-page'
const CreateTicketPageUser = () =>{
    return (
        <CreateTicketPage isAdmin={false} title={"Create Ticket"}/>
    )
}
export default CreateTicketPageUser