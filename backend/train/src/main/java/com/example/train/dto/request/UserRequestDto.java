package com.example.train.dto.request;

import java.io.Serializable;

public class UserRequestDto implements Serializable {

    private String userName;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String cmnd;
    private String roleName;
    
    public UserRequestDto(String userName, String fullName, String phoneNumber, String email, String cmnd, String roleName) {
        this.userName = userName;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.cmnd = cmnd;
        this.roleName = roleName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCmnd(String cmnd) {
        this.cmnd = cmnd;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getUserName() {
        return userName;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getCmnd() {
        return cmnd;
    }

    public String getRoleName() {
        return roleName;
    }

}
