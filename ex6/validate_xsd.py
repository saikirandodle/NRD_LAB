from lxml import etree

xml = etree.parse("bookstore-xsd.xml")
schema_doc = etree.parse("bookstore.xsd")
schema = etree.XMLSchema(schema_doc)

if schema.validate(xml):
    print("XSD Validation: Valid")
else:
    print("XSD Validation: Invalid")
    print(schema.error_log)
