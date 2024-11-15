package com.example.train.services.implement;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.train.dto.response.UserDetailResponse;
import com.example.train.services.TokenService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class TokenServiceImpl implements TokenService {

    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;


    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    @Override
    public String CreateToken(UserDetailResponse dto) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3_600_000);
        return JWT.create()
                .withIssuer(dto.getUsername())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("fullName", dto.getFullName())
                .withClaim("userId", dto.getUsername())
                .withClaim("role", dto.getRole())
                .sign(Algorithm.HMAC256(secretKey));
    }

    @Override
    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decoded = verifier.verify(token);

        UserDetailResponse u =  UserDetailResponse.builder()
                .username(decoded.getIssuer())
                .fullName(decoded.getClaim("fullName").asString())
                .role(decoded.getClaim("role").asString())
                .id(decoded.getClaim("userId").asInt())
                .build();

        return new UsernamePasswordAuthenticationToken(u, null, Collections.emptyList());
    }
}
