package com.bonos.backend.repository;

import com.bonos.backend.model.Cete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CeteRepository extends JpaRepository<Cete, Long> {
}
