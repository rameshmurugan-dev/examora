package com.examora.backend.security;

import com.examora.backend.user.entity.Role;
import com.examora.backend.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Spring Security UserDetails implementation.
 *
 * Wraps User entity for authentication context.
 * Immutable & production-safe.
 */
@Getter
public final class UserDetailsImpl implements UserDetails {

    private final Long id;
    private final String email;

    @JsonIgnore
    private final String password;

    private final boolean blocked;
    private final boolean active;
    private final Role role;

    private final Collection<? extends GrantedAuthority> authorities;

    private UserDetailsImpl(
            Long id,
            String email,
            String password,
            boolean blocked,
            boolean active,
            Role role,
            Collection<? extends GrantedAuthority> authorities) {

        this.id = id;
        this.email = email;
        this.password = password;
        this.blocked = blocked;
        this.active = active;
        this.role = role;
        this.authorities = authorities;
    }

    /**
     * Factory method to build UserDetails from User entity.
     */
    public static UserDetailsImpl build(User user) {

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.isBlocked(),
                user.isActive(),
                user.getRole(),
                authorities);
    }

    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Account lock logic.
     */
    @Override
    public boolean isAccountNonLocked() {
        return !blocked;
    }

    /**
     * Enable logic:
     * - SUPER_ADMIN & ADMIN always enabled
     * - STUDENT must activate via invite
     */
    @Override
    public boolean isEnabled() {

        if (role == Role.SUPER_ADMIN || role == Role.ADMIN) {
            return true;
        }

        return active;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}