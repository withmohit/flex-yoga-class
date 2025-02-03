
from datetime import datetime, timedelta
from db_init import User



def update_status(data,db):
    db_member = db.query(User).filter(User.phone == data.phone).first()
    new_valid_till = (datetime.now() + timedelta(days=30)).date()
    if db_member:
        # Update existing member details
        db_member.name = data.name
        db_member.gender = data.gender
        db_member.age = data.age
        db_member.batch_name = data.batch_name
        db_member.valid_till = new_valid_till
        print(f"After Update: {db_member.valid_till}")
        db.commit()
        db.refresh(db_member)
        return {"message": "Member updated successfully", "member": db_member}
    
    # Create a new member if not found
    new_member = User(
        name=data.name,
        phone=data.phone,
        gender=data.gender,
        age=data.age,
        batch_name=data.batch_name,
        valid_till = (datetime.now()+timedelta(days=30)).date()

    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return {"message": "New member added", "member": new_member}

def current_status(phone,db):
    
    db_member = db.query(User).filter(User.phone == phone).first()

    if db_member:
        print(db_member.valid_till)
        return {"name": db_member.name, "age": db_member.age, "gender": db_member.gender, "batch_name": db_member.batch_name, "valid_till": db_member.valid_till.strftime("%Y-%m-%d")}
    return {"message": "Member not found"}
    