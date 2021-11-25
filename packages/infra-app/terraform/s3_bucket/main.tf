locals {
  bucket_name = "meet.remotify.place"
}

resource "aws_s3_bucket" "remotify_app" {
  bucket = local.bucket_name
  acl = "private"
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers = ["ETag"]
    max_age_seconds = 3000
  }

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  tags = {
    Name = "remotify-app"
    Environment = terraform.workspace
  }

  policy = <<POLICY
{
  "Version": "2008-10-17",
  "Statement": [
  {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${local.bucket_name}/*"
  }]
}
POLICY

}


resource "aws_cloudfront_distribution" "s3_remotify_app_distribution" {
  origin {
    domain_name = aws_s3_bucket.remotify_app.bucket_regional_domain_name
    origin_id = "S3-${aws_s3_bucket.remotify_app.bucket}"

    # custom_origin_config {
    #   http_port = 80
    #   https_port = 443
    #   origin_protocol_policy = "match-viewer"
    #   origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    # }
  }

  enabled             = true
  # is_ipv6_enabled     = true
  comment = "remotify app"
  default_root_object = "index.html"

  aliases = ["meet.remotify.place"]

  default_cache_behavior {
    allowed_methods  = ["HEAD", "GET", "OPTIONS"]
    cached_methods   = ["HEAD", "GET"]
    target_origin_id = "S3-${aws_s3_bucket.remotify_app.bucket}"


    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    # min_ttl                = 0
    # default_ttl            = 3600
    # max_ttl                = 86400
  }

  tags = {
    Environment = "production"
    Name = "remotify app"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      # locations        = ["US", "CA", "GB", "DE"]
    }
  }

  # logging_config {
  #    bucket          = "remotify-app-cloudfront-logs.s3.amazonaws.com"
  #    include_cookies = false
  # }

  viewer_certificate {
    ssl_support_method = "sni-only"
    acm_certificate_arn = "arn:aws:acm:us-east-1:002172820271:certificate/bfa2eeb4-ebec-47b3-a092-e95f99bbc059"
  }
}