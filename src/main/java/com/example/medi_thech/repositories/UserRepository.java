package com.example.medi_thech.repositories;

import com.example.medi_thech.entities.User;
import com.example.medi_thech.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findFirstByUsernameAndRole(String admin, UserRole userRole);
}