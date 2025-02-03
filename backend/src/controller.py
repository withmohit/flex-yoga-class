from datetime import datetime, timedelta
from db_init import User, Enrollment
from fastapi.responses import JSONResponse


def update_status(data,db):
    db_member = db.query(User).filter(User.phone == data.phone).first()
    new_valid_till = (datetime.now() + timedelta(days=30)).date()
    if db_member and db_member.valid_till < datetime.now().date():
        # Update existing member details
        db_member.name = data.name
        db_member.gender = data.gender
        db_member.age = data.age
        db_member.batch_name = data.batch_name
        db_member.valid_till = new_valid_till

        new_payment= Enrollment(
            phone = data.phone,
            batch_name = data.batch_name,
            payment_status = "Success First Payment",
            amount = 500
        )
        
        db.add(new_payment)

        db.commit()
        db.refresh(db_member)
        db.refresh(new_payment)
        response = {
            "message": "Membership renewed successfully. Your membership is valid till " + new_valid_till.strftime("%Y-%m-%d")+"and payment of 500 is successful",
        }
        return response
    
    elif db_member and db_member.valid_till >= datetime.now().date():
        return {"message": "Membership already exists for your ongoing month"}
    
    # Create a new member if not found
    new_member = User(
        name=data.name,
        phone=data.phone,
        gender=data.gender,
        age=data.age,
        batch_name=data.batch_name,
        valid_till = (datetime.now()+timedelta(days=30)).date()

    )
    new_payment= Enrollment(
           phone = data.phone,
           batch_name = data.batch_name,
           payment_status = "Successful Payment",
           amount = 750
    )
        
    db.add(new_payment)


    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    db.refresh(new_payment)


    response = {
           "message":"Your first payment of 750 is successful and membership is valid till "+new_valid_till.strftime("%Y-%m-%d")
        }
    return response

def current_status(phone,db):
    
    db_member = db.query(User).filter(User.phone == phone).first()

    if db_member:
        print(db_member.valid_till)
        return {"name": db_member.name, "age": db_member.age, "gender": db_member.gender, "batch_name": db_member.batch_name, "valid_till": db_member.valid_till.strftime("%Y-%m-%d")}
    return {"message": "Member not found"}
    